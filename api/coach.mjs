const MAX_FIELD_LENGTH = 2_000;

function send(response, status, payload) {
  response.status(status);
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify(payload));
}

function text(value) {
  return typeof value === 'string'
    ? value.trim().slice(0, MAX_FIELD_LENGTH)
    : '';
}

function parseBody(request) {
  if (request.body && typeof request.body === 'object') {
    return request.body;
  }

  if (typeof request.body === 'string') {
    return JSON.parse(request.body);
  }

  return {};
}

function extractOutputText(payload) {
  if (typeof payload.output_text === 'string') {
    return payload.output_text;
  }

  if (!Array.isArray(payload.output)) {
    return '';
  }

  return payload.output
    .flatMap((item) => (Array.isArray(item?.content) ? item.content : []))
    .filter((item) => item?.type === 'output_text' && typeof item.text === 'string')
    .map((item) => item.text)
    .join('\n');
}

function parseJson(textValue) {
  const trimmed = textValue
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/, '');

  return JSON.parse(trimmed);
}

function validString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validList(value, minimum = 1) {
  return (
    Array.isArray(value) &&
    value.filter((item) => validString(item)).length >= minimum
  );
}

function isScopePlan(value) {
  return (
    value &&
    typeof value === 'object' &&
    validString(value.oneSentencePitch) &&
    validString(value.challenge) &&
    validString(value.firstMilestone) &&
    validList(value.included, 2) &&
    validList(value.postponed, 2) &&
    validString(value.successEvidence) &&
    validString(value.businessQuestion) &&
    validString(value.aiLiteracyQuestion) &&
    validList(value.risks, 1)
  );
}

function buildPrompt(project) {
  return `You are the scope coach for VibeCoding Business Studio, an educational product that teaches learners to own product decisions while using AI to build.

Your job is not to praise the idea. Challenge it constructively and reduce it to the smallest milestone that can create observable evidence.

Return ONLY valid JSON with exactly this shape:
{
  "oneSentencePitch": "string",
  "challenge": "string",
  "firstMilestone": "string",
  "included": ["string", "string"],
  "postponed": ["string", "string"],
  "successEvidence": "string",
  "businessQuestion": "string",
  "aiLiteracyQuestion": "string",
  "risks": ["string"]
}

Rules:
- Write all content in English.
- Keep the learner as product owner.
- The first milestone must fit the stated time and experience.
- Prefer one complete workflow over many disconnected screens.
- Explicitly postpone authentication, payments, scaling, complex integrations, and native apps unless they are essential to the first proof.
- Include a verification method that a learner can explain.
- Include one question about real user value.
- Include one question about verifying AI output.
- Flag privacy, minors' data, money, legal, publication, or irreversible changes for mentor supervision.
- Do not request secrets, credentials, private chats, or identifying information about minors.

Learner project:
${JSON.stringify(project, null, 2)}
`;
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    send(response, 405, { error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL;

  if (!apiKey || !model) {
    send(response, 503, {
      error:
        'The OpenAI coach is not configured. Set OPENAI_API_KEY and OPENAI_MODEL on the server.'
    });
    return;
  }

  let body;

  try {
    body = parseBody(request);
  } catch {
    send(response, 400, { error: 'Invalid JSON body' });
    return;
  }

  const rawProject =
    body.project && typeof body.project === 'object' ? body.project : {};

  const project = {
    title: text(rawProject.title),
    idea: text(rawProject.idea),
    audience: text(rawProject.audience),
    problem: text(rawProject.problem),
    motivation: text(rawProject.motivation),
    timebox: text(rawProject.timebox),
    skillLevel: text(rawProject.skillLevel)
  };

  if (!project.title || !project.idea || !project.audience || !project.problem) {
    send(response, 400, {
      error: 'Project title, idea, audience, and problem are required.'
    });
    return;
  }

  try {
    const upstream = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        input: buildPrompt(project)
      })
    });

    const payload = await upstream.json();

    if (!upstream.ok) {
      send(response, 502, {
        error: 'OpenAI request failed',
        detail:
          typeof payload?.error?.message === 'string'
            ? payload.error.message
            : `HTTP ${upstream.status}`
      });
      return;
    }

    const outputText = extractOutputText(payload);
    const plan = parseJson(outputText);

    if (!isScopePlan(plan)) {
      send(response, 502, {
        error: 'The model response did not match the expected scope-plan shape.'
      });
      return;
    }

    send(response, 200, {
      plan,
      model
    });
  } catch (error) {
    send(response, 502, {
      error: 'Unable to generate a scope plan',
      detail: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
