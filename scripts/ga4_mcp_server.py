#!/usr/bin/env python3
"""
FastMCP Server for Google Analytics 4 (GA4)
Provides deep intelligence, real-time metrics, retention analysis,
and custom telemetry directly to Antigravity IDE and agents.
"""

import os
import json
import datetime
from mcp.server.fastmcp import FastMCP
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange,
    Dimension,
    Metric,
    RunReportRequest,
    RunRealtimeReportRequest,
    OrderBy
)
from google.oauth2 import service_account

# Initialize FastMCP Server
mcp = FastMCP(
    "Google Analytics 4 Intelligence",
    description="Real-time and historical analytics, acquisition intelligence, and engagement telemetry for Wasim M Ansari portfolio."
)

PROPERTY_ID = os.environ.get("GA4_PROPERTY_ID", "503150594")
CREDS_PATH = os.environ.get("GA4_CREDENTIALS_PATH", os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "portfolio-analytics-507111-1262ef554c0c.json"))

def get_client():
    if os.path.exists(CREDS_PATH):
        creds = service_account.Credentials.from_service_account_file(CREDS_PATH)
    elif os.environ.get("GA4_CREDENTIALS_JSON"):
        creds_dict = json.loads(os.environ.get("GA4_CREDENTIALS_JSON"))
        creds = service_account.Credentials.from_service_account_info(creds_dict)
    else:
        raise ValueError(f"No GA4 credentials found at {CREDS_PATH} or in GA4_CREDENTIALS_JSON")
    return BetaAnalyticsDataClient(credentials=creds)

@mcp.tool()
def get_30d_kpi_summary() -> dict:
    """Fetch total active users, sessions, pageviews, average session duration, and bounce rate for the last 30 days."""
    client = get_client()
    req = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        dimensions=[],
        metrics=[
            Metric(name="activeUsers"),
            Metric(name="sessions"),
            Metric(name="screenPageViews"),
            Metric(name="averageSessionDuration"),
            Metric(name="bounceRate")
        ],
        date_ranges=[DateRange(start_date="30daysAgo", end_date="today")]
    )
    res = client.run_report(req)
    if not res.rows:
        return {"activeUsers": 0, "sessions": 0, "pageviews": 0, "avgDurationSec": 0, "bounceRate": 0}
    r = res.rows[0]
    return {
        "activeUsers": int(r.metric_values[0].value),
        "sessions": int(r.metric_values[1].value),
        "screenPageViews": int(r.metric_values[2].value),
        "avgSessionDurationSec": round(float(r.metric_values[3].value), 1),
        "avgSessionDurationFormatted": f"{int(float(r.metric_values[3].value))//60}m {int(float(r.metric_values[3].value))%60:02d}s",
        "bounceRate": f"{float(r.metric_values[4].value)*100:.1f}%" if r.metric_values[4].value else "0%"
    }

@mcp.tool()
def get_realtime_users() -> dict:
    """Fetch active users in the last 30 minutes from real-time GA4 stream."""
    try:
        client = get_client()
        req = RunRealtimeReportRequest(
            property=f"properties/{PROPERTY_ID}",
            dimensions=[Dimension(name="country")],
            metrics=[Metric(name="activeUsers")]
        )
        res = client.run_realtime_report(req)
        total_live = sum(int(r.metric_values[0].value) for r in res.rows) if res.rows else 0
        countries = [{"country": r.dimension_values[0].value, "users": int(r.metric_values[0].value)} for r in res.rows]
        return {"activeUsersLast30Min": total_live, "activeCountries": countries}
    except Exception as e:
        return {"error": str(e), "activeUsersLast30Min": 0}

@mcp.tool()
def get_geographic_breakdown(days: int = 30) -> list:
    """Get visitor breakdown by country with user counts and engagement time."""
    client = get_client()
    req = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        dimensions=[Dimension(name="country"), Dimension(name="city")],
        metrics=[Metric(name="activeUsers"), Metric(name="sessions"), Metric(name="averageSessionDuration")],
        date_ranges=[DateRange(start_date=f"{days}daysAgo", end_date="today")],
        order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="activeUsers"), desc=True)],
        limit=15
    )
    res = client.run_report(req)
    results = []
    for r in res.rows:
        results.append({
            "country": r.dimension_values[0].value,
            "city": r.dimension_values[1].value,
            "activeUsers": int(r.metric_values[0].value),
            "sessions": int(r.metric_values[1].value),
            "avgDurationSec": round(float(r.metric_values[2].value), 1)
        })
    return results

@mcp.tool()
def get_top_pages_and_sections(days: int = 30) -> list:
    """Get pageviews and engagement across pages and anchor sections (e.g. #flagship, #skills, #experience)."""
    client = get_client()
    req = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        dimensions=[Dimension(name="pagePathPlusQueryString")],
        metrics=[Metric(name="screenPageViews"), Metric(name="activeUsers"), Metric(name="userEngagementDuration")],
        date_ranges=[DateRange(start_date=f"{days}daysAgo", end_date="today")],
        order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="screenPageViews"), desc=True)],
        limit=10
    )
    res = client.run_report(req)
    return [
        {
            "page": r.dimension_values[0].value,
            "views": int(r.metric_values[0].value),
            "users": int(r.metric_values[1].value),
            "totalEngagementSec": round(float(r.metric_values[2].value), 1)
        }
        for r in res.rows
    ]

@mcp.tool()
def get_custom_events(days: int = 30) -> list:
    """Get custom portfolio event telemetry (e.g. cv_download, whatsapp_click, modal_open, project_click)."""
    client = get_client()
    req = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        dimensions=[Dimension(name="eventName")],
        metrics=[Metric(name="eventCount"), Metric(name="activeUsers")],
        date_ranges=[DateRange(start_date=f"{days}daysAgo", end_date="today")],
        order_bys=[OrderBy(metric=OrderBy.MetricOrderBy(metric_name="eventCount"), desc=True)],
        limit=20
    )
    res = client.run_report(req)
    return [
        {
            "eventName": r.dimension_values[0].value,
            "eventCount": int(r.metric_values[0].value),
            "uniqueUsers": int(r.metric_values[1].value)
        }
        for r in res.rows
    ]

@mcp.tool()
def run_custom_query(dimensions: list[str], metrics: list[str], start_date: str = "30daysAgo", end_date: str = "today", limit: int = 10) -> list:
    """Execute an arbitrary GA4 Data API query with custom dimensions and metrics."""
    client = get_client()
    req = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        dimensions=[Dimension(name=d) for d in dimensions],
        metrics=[Metric(name=m) for m in metrics],
        date_ranges=[DateRange(start_date=start_date, end_date=end_date)],
        limit=limit
    )
    res = client.run_report(req)
    output = []
    for r in res.rows:
        row_dict = {}
        for idx, d in enumerate(dimensions):
            row_dict[d] = r.dimension_values[idx].value
        for idx, m in enumerate(metrics):
            row_dict[m] = r.metric_values[idx].value
        output.append(row_dict)
    return output

if __name__ == "__main__":
    mcp.run(transport="stdio")
