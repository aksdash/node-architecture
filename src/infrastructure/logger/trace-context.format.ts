import winston from 'winston'

import {trace} from '@opentelemetry/api'

export const traceContextFormat = winston.format((info) => {
    const span = trace.getActiveSpan()

    if(span){
         const context = span?.spanContext()
         info.traceId = context.traceId
         info.spanId = context.spanId

    }

    return info

})