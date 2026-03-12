import FeatureHeader from '../../components/features/FeatureHeader'
import FeatureDescription from '../../components/features/FeatureDescription'
import AIAssistant from '../AIAssistant'

const insightCards = [
  {
    title: 'Agentic briefing mode',
    body: 'The assistant chains retrieval, reasoning, and validation steps so every answer references the same event intelligence powering the dashboard.'
  },
  {
    title: 'Operational readiness cues',
    body: 'Responses return risk, confidence, and recommended next steps so operations teams can immediately triage the issue.'
  },
  {
    title: 'Judge-friendly prompts',
    body: 'Pre-seeded questions showcase how quickly the AI can translate conflicts into energy, trade, or supply-chain implications.'
  }
]

export default function AIAssistantFeature() {
  return (
    <div className="space-y-10">
      <FeatureHeader
        eyebrow="AI workbench"
        title="AI Geopolitical Intelligence Assistant"
        subtitle="Sit a virtual analyst next to every judge—ask about ripple effects, shipping routes, or commodity shocks and get a briefing-grade response."
      />

      <section className="grid md:grid-cols-3 gap-4">
        {insightCards.map((card) => (
          <FeatureDescription key={card.title} title={card.title}>
            <p>{card.body}</p>
          </FeatureDescription>
        ))}
      </section>

      <div className="card">
        <AIAssistant />
      </div>
    </div>
  )
}
