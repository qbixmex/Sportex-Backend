import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const RawHeaders = createParamDecorator((
  _data: string,
  context: ExecutionContext,
): string[] => {
  const request = context.switchToHttp().getRequest();
  return request.rawHeaders;
});
