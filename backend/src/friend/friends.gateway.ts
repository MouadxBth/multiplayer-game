import { UseFilters, UseGuards, UsePipes } from "@nestjs/common";
import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AuthenticatedUser } from "src/auth/entities/authenticated-user.entity";
import { WsAuthenticatedGuard } from "src/auth/guards/ws-authenticated.guard";
import { WsExceptionFilter } from "src/socket-io/ws-exception.filter";
import { WsValidationPipe } from "src/socket-io/ws-validation.pipe";
import { type Request } from "express";
import { FriendService } from "src/friend/friend.service";

@WebSocketGateway({ namespace: "notifications" })
@UsePipes(WsValidationPipe)
@UseFilters(WsExceptionFilter)
@UseGuards(WsAuthenticatedGuard)
export class FriendGateway {
	@WebSocketServer()
	private readonly server: Server;

	constructor(private readonly friendService: FriendService) {}

	@SubscribeMessage("send_friend_request")
	async handleFriendRequest(@ConnectedSocket() client: Socket, @MessageBody() payload: string) {
		const authenticatedUser = (client.request as Request).user! as AuthenticatedUser;
		const result = await this.friendService.sendFriendRequest(
			authenticatedUser.user.username,
			payload
		);
		this.server.emit("receive_friend_request", result);
	}

	@SubscribeMessage("accept_friend_request")
	async handleAccept(@ConnectedSocket() client: Socket, @MessageBody() payload: string) {
		const authenticatedUser = (client.request as Request).user! as AuthenticatedUser;
		const result = await this.friendService.acceptFriendRequest(
			authenticatedUser.user.username,
			payload
		);
		const second = await this.friendService.friendsOf(authenticatedUser.user.username, payload);
		this.server.emit("friend_request_accepted", result);
		this.server.emit("friends_updated", second);
	}

	@SubscribeMessage("deny_friend_request")
	async handleDeny(@ConnectedSocket() client: Socket, @MessageBody() payload: string) {
		const authenticatedUser = (client.request as Request).user! as AuthenticatedUser;
		const result = await this.friendService.denyFriendRequest(
			authenticatedUser.user.username,
			payload
		);
		this.server.emit("friend_request_denied", result);
	}

	@SubscribeMessage("cancel_friend_request")
	async handleCancel(@ConnectedSocket() client: Socket, @MessageBody() payload: string) {
		const authenticatedUser = (client.request as Request).user! as AuthenticatedUser;
		const result = await this.friendService.cancelFriendRequest(
			authenticatedUser.user.username,
			payload
		);
		this.server.emit("friend_request_canceled", result);
	}

	@SubscribeMessage("unfriend_request")
	async handleUnfriend(@ConnectedSocket() client: Socket, @MessageBody() payload: string) {
		const authenticatedUser = (client.request as Request).user! as AuthenticatedUser;
		const result = await this.friendService.unfriendUser(authenticatedUser.user.username, payload);

		const second = await this.friendService.friendsOf(authenticatedUser.user.username, payload);

		this.server.emit("unfriend", result);
		this.server.emit("friends_updated", second);
	}
}
