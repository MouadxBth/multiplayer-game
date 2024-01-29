import { Module } from "@nestjs/common";
import { NotificationsGateway } from "./notifications.gateway";
import { FriendModule } from "src/friend/friend.module";
import { OnlineStatusModule } from "src/online-status/online-status.module";

@Module({
	providers: [NotificationsGateway],
	imports: [FriendModule, OnlineStatusModule],
})
export class NotificationsModule {}
