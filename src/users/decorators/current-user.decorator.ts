import {
    createParamDecorator,
    ExecutionContext
} from '@nestjs/common';

export const CurrentUser = createParamDecorator(
    (data: never, context: ExecutionContext) => {
        const request = context.switchToHttp();
        console.log("request - ",request);
        console.log("data ", data);
        
        

        return request.getRequest().currentUser;
    }
)