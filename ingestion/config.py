from pathlib import Path

# Base directories
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "output"
DATA_DIR.mkdir(exist_ok=True)

# Source URLs
GDELT_LASTUPDATE_URL = "http://data.gdeltproject.org/gdeltv2/lastupdate.txt"
GDELT_BASE_URL = "http://data.gdeltproject.org/gdeltv2"

# Default reliability priors per source (0-1)
SOURCE_BASE_RELIABILITY = {
    "GDELT": 0.70,
    "ACLED": 0.82,
    "NEWSAPI": 0.65,
    "WORLD_BANK": 0.88,
    "FRED": 0.90,
    "ENERGY": 0.80,
}

# Simple mapping of GDELT EventRootCode to label
EVENT_ROOT_MAP = {
    "01": "Make public statement",
    "02": "Appeal",
    "03": "Express intent to cooperate",
    "04": "Consult",
    "05": "Engage in diplomatic cooperation",
    "06": "Engage in material cooperation",
    "07": "Provide aid",
    "08": "Yield",
    "09": "Investigate",
    "10": "Demand",
    "11": "Disapprove",
    "12": "Reject",
    "13": "Threaten",
    "14": "Protest",
    "15": "Exhibit force posture",
    "16": "Reduce relations",
    "17": "Coerce",
    "18": "Assault",
    "19": "Fight",
    "20": "Use unconventional mass violence",
}

# Fields as defined in GDELT 2.1 event schema
GDELT_COLUMNS = [
    "GLOBALEVENTID",
    "SQLDATE",
    "MonthYear",
    "Year",
    "FractionDate",
    "Actor1Code",
    "Actor1Name",
    "Actor1CountryCode",
    "Actor1KnownGroupCode",
    "Actor1EthnicCode",
    "Actor1Religion1Code",
    "Actor1Religion2Code",
    "Actor1Type1Code",
    "Actor1Type2Code",
    "Actor1Type3Code",
    "Actor2Code",
    "Actor2Name",
    "Actor2CountryCode",
    "Actor2KnownGroupCode",
    "Actor2EthnicCode",
    "Actor2Religion1Code",
    "Actor2Religion2Code",
    "Actor2Type1Code",
    "Actor2Type2Code",
    "Actor2Type3Code",
    "IsRootEvent",
    "EventCode",
    "EventBaseCode",
    "EventRootCode",
    "QuadClass",
    "GoldsteinScale",
    "NumMentions",
    "NumSources",
    "NumArticles",
    "AvgTone",
    "Actor1Geo_Type",
    "Actor1Geo_FullName",
    "Actor1Geo_CountryCode",
    "Actor1Geo_ADM1Code",
    "Actor1Geo_Lat",
    "Actor1Geo_Long",
    "Actor1Geo_FeatureID",
    "Actor2Geo_Type",
    "Actor2Geo_FullName",
    "Actor2Geo_CountryCode",
    "Actor2Geo_ADM1Code",
    "Actor2Geo_Lat",
    "Actor2Geo_Long",
    "Actor2Geo_FeatureID",
    "ActionGeo_Type",
    "ActionGeo_FullName",
    "ActionGeo_CountryCode",
    "ActionGeo_ADM1Code",
    "ActionGeo_Lat",
    "ActionGeo_Long",
    "ActionGeo_FeatureID",
    "DATEADDED",
    "SOURCEURL",
]
