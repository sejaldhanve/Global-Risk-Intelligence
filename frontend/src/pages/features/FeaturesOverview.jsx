import FeatureHeader from '../../components/features/FeatureHeader'
import FeatureCard from '../../components/features/FeatureCard'
import {
  Globe,
  Filter,
  Activity,
  LineChart,
  BadgeCheck,
  MessageCircle,
  Bot
} from 'lucide-react'

const featureList = [
  {
    title: 'Region Intelligence Map',
    description: 'Visualize conflict clusters, proximity impacts, and escalation paths across every region.',
    to: '/features/region-intelligence',
    icon: Globe
  },
  {
    title: 'Domain Intelligence Filtering',
    description: 'Slice events by verified news, economic signals, shipping activity, energy supply, logistics, or public discourse.',
    to: '/features/domain-filtering',
    icon: Filter
  },
  {
    title: 'Systemic Impact Analysis',
    description: 'Trace how regional events cascade into energy shortages, trade choke points, and commodity volatility.',
    to: '/features/system-impact',
    icon: Activity
  },
  {
    title: 'Risk Forecasting',
    description: 'Blend live indicators with predictive models to surface the next wave of high-risk flashpoints.',
    to: '/features/risk-forecast',
    icon: LineChart
  },
  {
    title: 'Narrative vs Reality',
    description: 'Compare circulating narratives against verified telemetry to flag misinformation and weak signals.',
    to: '/features/narrative-analysis',
    icon: BadgeCheck
  },
  {
    title: 'Public Discourse Signals',
    description: 'Monitor Reddit, Twitter, and open-source chatter for sentiment swings and emerging concerns.',
    to: '/features/public-discourse',
    icon: MessageCircle
  },
  {
    title: 'AI Intelligence Assistant',
    description: 'Ask an agentic analyst how conflicts impact trade routes, commodities, or regional stability in seconds.',
    to: '/features/ai-assistant',
    icon: Bot
  }
]

export default function FeaturesOverview() {
  return (
    <div className="space-y-10">
      <FeatureHeader
        eyebrow="Feature showcase"
        title="Global Intelligence Playbook"
        subtitle="Dedicated walkthroughs for every capability judges will see during the hackathon demo."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {featureList.map((feature) => (
          <FeatureCard key={feature.to} {...feature} />
        ))}
      </div>
    </div>
  )
}
