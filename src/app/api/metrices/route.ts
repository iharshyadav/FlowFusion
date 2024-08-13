import { NextRequest, NextResponse } from "next/server";
import client from "prom-client"

const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({register : client.register})

export async function GET(req: NextRequest): Promise<NextResponse> {
    const metrices = await client.register.metrics();
    const res = new NextResponse(metrices, {
      headers: { "Content-Type": client.register.contentType },
    });
    return res;
  }