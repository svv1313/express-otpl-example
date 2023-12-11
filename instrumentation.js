const { NodeSDK } = require("@opentelemetry/sdk-node");
const { ConsoleSpanExporter } = require("@opentelemetry/sdk-trace-node");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
  MeterProvider,
} = require("@opentelemetry/sdk-metrics");
const { Resource } = require("@opentelemetry/resources");
const {
  SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { ExpressInstrumentation } = require("@opentelemetry/instrumentation-express");
const opentelemetry = require("@opentelemetry/api");

const metricReader = new PeriodicExportingMetricReader({
  exporter: new ConsoleMetricExporter(),

  exportIntervalMillis: 60000,
});

const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: 'Service',
});

const sdk = new NodeSDK({
  resource,
  traceExporter: new ConsoleSpanExporter(),
  instrumentations: [new HttpInstrumentation(), new ExpressInstrumentation()],
});

const myServiceMeterProvider = new MeterProvider({
  resource: resource,
});

myServiceMeterProvider.addMetricReader(metricReader);

opentelemetry.metrics.setGlobalMeterProvider(myServiceMeterProvider);

sdk.start();
