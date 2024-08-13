import client from "prom-client"

const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({register : client.register})