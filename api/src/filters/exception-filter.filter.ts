import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { SamozError } from '@samoz/utils';

@Catch(SamozError)
export class SamozExceptionFilter implements ExceptionFilter<SamozError> {
  catch(exception: SamozError<any>, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.httpErrorCode || 500;

    console.log('exception', exception);

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error:
        process.env.NODE_ENV === 'development' ? exception.errorPayload : {},
      type: process.env.NODE_ENV === 'development' ? exception.type : {},
    });
  }
}
