import { ArgumentsHost, Catch, HttpException, HttpStatus } from "@nestjs/common";
import { BaseWsExceptionFilter, WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { AuthenticatedUser } from "src/auth/entities/authenticated-user.entity";
import { type Request } from "express";

@Catch(Error)
export class WsExceptionFilter extends BaseWsExceptionFilter {
	override catch(exception: Error, host: ArgumentsHost) {
		const context = host.switchToWs();
		const client = context.getClient<Socket>();
		const data = context.getData();
		const authenticatedUser = (client.request as Request).user! as AuthenticatedUser;

		console.log(exception);

		if (exception instanceof HttpException) {
			client.emit("error", {
				authenticatedUser,
				error: exception.name,
				status: exception.getStatus(),
				message: exception.message,
				cause: exception.cause,
				data: data,
			});
		} else if (exception instanceof WsException) {
			client.emit("error", {
				authenticatedUser,
				error: exception.name,
				message: exception.getError().toString(),
				cause: exception.cause,
				data: data,
			});
		} else throw new HttpException("Something bad happened!", HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
