import numpy as np
from typing import List, Dict

class ImpactModel:
    def __init__(self):
        self.sector_weights = {
            'energy': 0.9,
            'trade': 0.85,
            'military': 0.8,
            'finance': 0.75,
            'technology': 0.7,
            'agriculture': 0.65,
            'shipping': 0.8,
            'manufacturing': 0.7
        }
        
        self.region_multipliers = {
            'Middle East': 1.5,
            'Eastern Europe': 1.4,
            'East Asia': 1.3,
            'Southeast Asia': 1.2,
            'Africa': 1.1,
            'Latin America': 1.0
        }

    def analyze(self, event: str, event_type: str, country: str, 
                region: str, sectors: List[str]) -> Dict:
        
        severity_score = self._calculate_severity(event_type, country, region)
        
        sector_impacts = self._analyze_sector_impacts(event_type, sectors)
        
        economic_impact = self._estimate_economic_impact(severity_score, sector_impacts)
        
        affected_regions = self._identify_affected_regions(country, region)
        
        cascading_effects = self._analyze_cascading_effects(event_type, sectors)
        
        return {
            'severityScore': round(severity_score, 2),
            'economicImpact': economic_impact,
            'sectorImpacts': sector_impacts,
            'affectedRegions': affected_regions,
            'cascadingEffects': cascading_effects,
            'confidence': self._calculate_impact_confidence(event_type, sectors)
        }

    def _calculate_severity(self, event_type: str, country: str, region: str) -> float:
        base_severity = {
            'war': 0.9,
            'sanction': 0.7,
            'attack': 0.75,
            'trade_dispute': 0.5,
            'natural_disaster': 0.6,
            'political_crisis': 0.55
        }
        
        severity = base_severity.get(event_type, 0.5)
        region_multiplier = self.region_multipliers.get(region, 1.0)
        final_severity = min(1.0, severity * region_multiplier)
        
        return final_severity * 100

    def _analyze_sector_impacts(self, event_type: str, sectors: List[str]) -> List[Dict]:
        event_sector_impacts = {
            'war': {
                'energy': 0.9,
                'military': 0.95,
                'trade': 0.85,
                'shipping': 0.8,
                'finance': 0.7
            },
            'sanction': {
                'trade': 0.9,
                'finance': 0.85,
                'technology': 0.75,
                'energy': 0.8
            },
            'attack': {
                'shipping': 0.9,
                'energy': 0.85,
                'military': 0.8,
                'trade': 0.7
            }
        }
        
        impacts = []
        event_impacts = event_sector_impacts.get(event_type, {})
        
        for sector in sectors:
            impact_score = event_impacts.get(sector, 0.5)
            weight = self.sector_weights.get(sector, 0.5)
            final_impact = impact_score * weight * 100
            
            impacts.append({
                'sector': sector,
                'impactScore': round(final_impact, 1),
                'severity': self._get_severity_label(final_impact),
                'description': self._get_sector_impact_description(sector, event_type)
            })
        
        return sorted(impacts, key=lambda x: x['impactScore'], reverse=True)

    def _estimate_economic_impact(self, severity_score: float, sector_impacts: List[Dict]) -> Dict:
        if not sector_impacts:
            avg_impact = severity_score
        else:
            avg_impact = np.mean([s['impactScore'] for s in sector_impacts])
        
        if avg_impact >= 80:
            magnitude = 'catastrophic'
            estimated_loss = '>$100B'
        elif avg_impact >= 60:
            magnitude = 'severe'
            estimated_loss = '$10B-$100B'
        elif avg_impact >= 40:
            magnitude = 'moderate'
            estimated_loss = '$1B-$10B'
        else:
            magnitude = 'minimal'
            estimated_loss = '<$1B'
        
        return {
            'magnitude': magnitude,
            'estimatedLoss': estimated_loss,
            'impactScore': round(avg_impact, 1)
        }

    def _identify_affected_regions(self, country: str, region: str) -> List[str]:
        regional_connections = {
            'Middle East': ['Europe', 'Asia', 'North Africa'],
            'Eastern Europe': ['Western Europe', 'Central Asia', 'Middle East'],
            'East Asia': ['Southeast Asia', 'North America', 'Oceania'],
            'Southeast Asia': ['East Asia', 'South Asia', 'Oceania']
        }
        
        affected = [region]
        if region in regional_connections:
            affected.extend(regional_connections[region][:2])
        
        return list(set(affected))

    def _analyze_cascading_effects(self, event_type: str, sectors: List[str]) -> List[str]:
        effects = []
        
        if event_type == 'war':
            effects.extend([
                'Refugee crisis and humanitarian impact',
                'Regional military escalation risk',
                'Global supply chain disruptions'
            ])
        elif event_type == 'sanction':
            effects.extend([
                'Alternative trade route development',
                'Currency devaluation pressure',
                'Black market activity increase'
            ])
        elif event_type == 'attack':
            effects.extend([
                'Insurance premium increases',
                'Security protocol changes',
                'Alternative routing requirements'
            ])
        
        if 'energy' in sectors:
            effects.append('Global energy price volatility')
        if 'shipping' in sectors:
            effects.append('International trade delays')
        if 'finance' in sectors:
            effects.append('Market instability and capital flight')
        
        return effects[:5]

    def _calculate_impact_confidence(self, event_type: str, sectors: List[str]) -> float:
        confidence = 60.0
        
        if len(sectors) > 3:
            confidence += 15.0
        elif len(sectors) > 1:
            confidence += 10.0
        
        high_confidence_events = ['war', 'sanction', 'attack']
        if event_type in high_confidence_events:
            confidence += 15.0
        
        return min(95.0, confidence)

    def _get_severity_label(self, score: float) -> str:
        if score >= 80:
            return 'critical'
        elif score >= 60:
            return 'high'
        elif score >= 40:
            return 'medium'
        else:
            return 'low'

    def _get_sector_impact_description(self, sector: str, event_type: str) -> str:
        descriptions = {
            'energy': {
                'war': 'Supply disruptions and price volatility',
                'sanction': 'Export restrictions and market shifts',
                'attack': 'Infrastructure damage and security concerns'
            },
            'trade': {
                'war': 'Border closures and route disruptions',
                'sanction': 'Trade restrictions and tariff impacts',
                'attack': 'Logistics and transportation challenges'
            },
            'shipping': {
                'war': 'Route closures and security risks',
                'attack': 'Port and vessel security threats',
                'sanction': 'Restricted access to ports and routes'
            }
        }
        
        return descriptions.get(sector, {}).get(event_type, 'Significant impact expected')
