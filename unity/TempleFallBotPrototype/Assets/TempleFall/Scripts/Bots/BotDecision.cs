namespace TempleFall.Bots
{
    public readonly struct BotDecision
    {
        public BotDecision(BotState nextState, string reason)
        {
            NextState = nextState;
            Reason = reason;
        }

        public BotState NextState { get; }
        public string Reason { get; }
    }
}

