import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common"
import { Request } from "express"

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // const request: Request = context.switchToHttp().getRequest()
    // const cookies = request.cookies
    // console.log(cookies)
    // if (!cookies.access_token) {
    //   throw new UnauthorizedException("No access token found")
    // }

    // Verify the token here (using a service, etc.)
    // For example, you could verify it by calling a service that checks the token against Spotify's API.

    // If token is valid:
    return true

    // If token is not valid, throw an error:
    // throw new UnauthorizedException('Invalid token');
  }
}
