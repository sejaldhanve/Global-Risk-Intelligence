import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import List, Optional

class ForecastEngine:
    def __init__(self):
        self.commodity_volatility = {
            'oil': 0.15,
            'gas': 0.20,
            'wheat': 0.18,
            'shipping': 0.25,
            'gold': 0.10,
            'metals': 0.12
        }
        
        self.event_impact_multipliers = {
            'war': {
                'critical': 1.8,
                'high': 1.4,
                'medium': 1.2,
                'low': 1.05
            },
            'sanction': {
                'critical': 1.6,
                'high': 1.3,
                'medium': 1.15,
                'low': 1.05
            },
            'attack': {
                'critical': 1.5,
                'high': 1.25,
                'medium': 1.12,
                'low': 1.04
            },
            'trade_dispute': {
                'critical': 1.3,
                'high': 1.15,
                'medium': 1.08,
                'low': 1.03
            },
            'natural_disaster': {
                'critical': 1.4,
                'high': 1.2,
                'medium': 1.1,
                'low': 1.04
            },
            'political_crisis': {
                'critical': 1.25,
                'high': 1.12,
                'medium': 1.06,
                'low': 1.02
            }
        }
        
        self.country_importance = {
            'Russia': 0.9,
            'China': 0.95,
            'USA': 0.95,
            'Saudi Arabia': 0.85,
            'Iran': 0.75,
            'Ukraine': 0.7,
            'Israel': 0.65,
            'UAE': 0.6,
            'Iraq': 0.6,
            'Venezuela': 0.5
        }

    def predict(self, event: str, event_type: str, country: str, 
                commodity: str, severity: str, historical_data: Optional[List[float]] = None):
        
        base_price = self._get_base_price(commodity, historical_data)
        
        impact_multiplier = self._calculate_impact_multiplier(
            event_type, severity, country, commodity
        )
        
        predicted_price = base_price * impact_multiplier
        
        change_percent = ((predicted_price - base_price) / base_price) * 100
        
        confidence = self._calculate_confidence(
            event_type, severity, country, commodity, historical_data
        )
        
        timeframe = self._estimate_timeframe(event_type, severity)
        
        trend = 'increase' if predicted_price > base_price else 'decrease'
        
        factors = self._identify_factors(event_type, country, commodity)
        
        return {
            'commodity': commodity,
            'currentPrice': round(base_price, 2),
            'predictedPrice': round(predicted_price, 2),
            'prediction': f"{'+' if change_percent > 0 else ''}{round(change_percent, 1)}%",
            'confidence': round(confidence, 1),
            'timeframe': timeframe,
            'trend': trend,
            'factors': factors,
            'modelUsed': 'prophet-ml',
            'impactMultiplier': round(impact_multiplier, 3)
        }

    def _get_base_price(self, commodity: str, historical_data: Optional[List[float]]) -> float:
        if historical_data and len(historical_data) > 0:
            return np.mean(historical_data[-30:])
        
        base_prices = {
            'oil': 85.0,
            'gas': 3.5,
            'wheat': 6.8,
            'shipping': 2500.0,
            'gold': 2000.0,
            'metals': 8500.0
        }
        
        return base_prices.get(commodity, 100.0)

    def _calculate_impact_multiplier(self, event_type: str, severity: str, 
                                     country: str, commodity: str) -> float:
        
        base_multiplier = self.event_impact_multipliers.get(event_type, {}).get(severity, 1.1)
        
        country_factor = self.country_importance.get(country, 0.5)
        
        volatility = self.commodity_volatility.get(commodity, 0.15)
        
        final_multiplier = 1 + ((base_multiplier - 1) * country_factor * (1 + volatility))
        
        return final_multiplier

    def _calculate_confidence(self, event_type: str, severity: str, country: str,
                              commodity: str, historical_data: Optional[List[float]]) -> float:
        
        confidence = 50.0
        
        if historical_data and len(historical_data) > 20:
            confidence += 15.0
        elif historical_data and len(historical_data) > 10:
            confidence += 10.0
        
        if country in self.country_importance:
            confidence += self.country_importance[country] * 15
        
        severity_confidence = {
            'critical': 20,
            'high': 15,
            'medium': 10,
            'low': 5
        }
        confidence += severity_confidence.get(severity, 5)
        
        if commodity in ['oil', 'gas', 'wheat']:
            confidence += 10
        
        return min(95.0, max(30.0, confidence))

    def _estimate_timeframe(self, event_type: str, severity: str) -> str:
        timeframes = {
            'war': {
                'critical': '3months',
                'high': '1month',
                'medium': '1month',
                'low': '1week'
            },
            'sanction': {
                'critical': '6months',
                'high': '3months',
                'medium': '1month',
                'low': '1month'
            },
            'attack': {
                'critical': '1month',
                'high': '1week',
                'medium': '1week',
                'low': '1day'
            }
        }
        
        return timeframes.get(event_type, {}).get(severity, '1month')

    def _identify_factors(self, event_type: str, country: str, commodity: str) -> List[str]:
        factors = []
        
        factors.append(f"{event_type.replace('_', ' ').title()} event impact")
        factors.append(f"{country} geopolitical situation")
        factors.append(f"{commodity.title()} market volatility")
        
        if event_type == 'war':
            factors.append("Supply chain disruptions")
            factors.append("Trade route security")
        elif event_type == 'sanction':
            factors.append("Export restrictions")
            factors.append("Alternative supplier dynamics")
        elif event_type == 'attack':
            factors.append("Infrastructure damage")
            factors.append("Insurance premium increases")
        
        if commodity == 'oil':
            factors.append("OPEC+ production decisions")
        elif commodity == 'gas':
            factors.append("Pipeline capacity constraints")
        elif commodity == 'wheat':
            factors.append("Global food security concerns")
        
        return factors[:6]

    def generate_time_series(self, commodity: str, days: int = 90) -> pd.DataFrame:
        dates = pd.date_range(start=datetime.now() - timedelta(days=days), 
                             end=datetime.now(), freq='D')
        
        base_price = self._get_base_price(commodity, None)
        volatility = self.commodity_volatility.get(commodity, 0.15)
        
        prices = []
        current_price = base_price
        
        for _ in range(len(dates)):
            change = np.random.normal(0, volatility * current_price / 30)
            current_price = max(current_price + change, base_price * 0.5)
            prices.append(current_price)
        
        df = pd.DataFrame({
            'ds': dates,
            'y': prices
        })
        
        return df
