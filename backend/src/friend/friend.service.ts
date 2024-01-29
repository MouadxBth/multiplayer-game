import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class FriendService {
	constructor(private readonly prismaService: PrismaService) {}

	async friends(username: string) {
		const result = await this.prismaService.user.findUnique({
			where: { username },
			select: {
				username: true,
				friends: {
					select: { username: true, nickname: true, avatar: true, firstName: true, lastName: true },
				},
			},
		});

		if (!result) throw new HttpException("User does not exist!", HttpStatus.NOT_FOUND);

		return result.friends;
	}

	async friendsOf(first: string, second: string) {
		const result = await Promise.all([
			this.prismaService.user.findUnique({
				where: { username: first },
				select: {
					username: true,
					nickname: true,
					friends: {
						select: {
							username: true,
							nickname: true,
							avatar: true,
							firstName: true,
							lastName: true,
						},
					},
				},
			}),
			this.prismaService.user.findUnique({
				where: { username: second },
				select: {
					username: true,
					nickname: true,
					friends: {
						select: {
							username: true,
							nickname: true,
							avatar: true,
							firstName: true,
							lastName: true,
						},
					},
				},
			}),
		]).then((values) => {
			return {
				first: values[0],
				second: values[1],
			};
		});

		if (!result) throw new HttpException("User does not exist!", HttpStatus.NOT_FOUND);

		return result;
	}

	async sendFriendRequest(username: string, target: string) {
		console.log("CALLED");
		if (username === target)
			throw new HttpException("Cannot send a friend request to yourself!", HttpStatus.BAD_REQUEST);

		const userWithFriends = await this.friends(username);

		if (userWithFriends.find((friend) => friend.username === target))
			throw new HttpException("Target is already a friend of you!", HttpStatus.BAD_REQUEST);

		const senderRequest = await this.prismaService.friendRequest.findFirst({
			where: {
				sender: { username },
				target: { username: target },
			},
		});

		if (senderRequest) throw new HttpException("Request already sent!", HttpStatus.BAD_REQUEST);

		const targetRequest = await this.prismaService.friendRequest.findFirst({
			where: {
				sender: { username: target },
				target: { username },
			},
		});

		if (targetRequest)
			throw new HttpException("Target already sent you a request!", HttpStatus.BAD_REQUEST);

		const result = await this.prismaService.friendRequest.create({
			data: {
				sender: { connect: { username } },
				target: { connect: { username: target } },
			},
			include: {
				sender: {
					select: {
						nickname: true,
					},
				},
				target: {
					select: {
						nickname: true,
					},
				},
			},
		});

		return {
			id: result.id,
			createdAt: result.createdAt,
			senderId: result.senderId,
			senderNickname: result.sender.nickname,
			targetId: result.targetId,
			targetNickname: result.target.nickname,
		};
	}

	async sentFriendRequests(username: string) {
		const result = await this.prismaService.user.findUnique({
			where: { username },
			select: {
				username: true,
				sentFriendRequests: { select: { id: true, targetId: true } },
			},
		});

		if (!result) throw new HttpException("User does not exist!", HttpStatus.NOT_FOUND);

		return {
			username: result.username,
			sentFriendRequests: result.sentFriendRequests.map((request) => request.targetId),
		};
	}

	async receivedFriendRequests(username: string) {
		const result = await this.prismaService.user.findUnique({
			where: { username },
			select: {
				username: true,
				receivedFriendRequests: { select: { id: true, senderId: true } },
			},
		});

		if (!result) throw new HttpException("User does not exist!", HttpStatus.NOT_FOUND);

		return {
			username: result.username,
			receivedFriendRequests: result.receivedFriendRequests.map((request) => request.senderId),
		};
	}

	async friendStatus(username: string, target: string) {
		if (username === target)
			throw new HttpException("Cannot check friend status with yourself!", HttpStatus.BAD_REQUEST);

		return await Promise.all([
			this.friends(username).then((result) => result.some((friend) => friend.username === target)),
			this.prismaService.friendRequest.findFirst({
				where: {
					OR: [
						{
							sender: { username },
							target: { username: target },
						},
						{
							sender: { username: target },
							target: { username },
						},
					],
				},
			}),
		]).then((value) => {
			return {
				friends: value[0],
				sentRequest: value[1]?.senderId === username,
				receivedRequest: value[1]?.senderId === target,
			};
		});
	}

	async acceptFriendRequest(username: string, sender: string) {
		if (username === sender)
			throw new HttpException(
				"Cannot accept a friend request to yourself!",
				HttpStatus.BAD_REQUEST
			);

		const userWithFriends = await this.friends(username);

		if (userWithFriends.find((value) => value.username === sender))
			throw new HttpException("Target is already a friend of you!", HttpStatus.BAD_REQUEST);

		const friendRequest = await this.prismaService.friendRequest.findFirst({
			where: {
				sender: { username: sender },
				target: { username },
			},
		});

		if (!friendRequest)
			throw new HttpException("No request from target to accept!", HttpStatus.BAD_REQUEST);

		await Promise.all([
			this.prismaService.user.update({
				where: { username: sender },
				data: {
					friends: { connect: { username } },
				},
				select: {
					username: true,
					friends: { select: { username: true } },
				},
			}),
			this.prismaService.user.update({
				where: { username },
				data: {
					friends: { connect: { username: sender } },
				},
				select: {
					username: true,
					friends: { select: { username: true } },
				},
			}),
		]);

		const result = await this.prismaService.friendRequest.delete({
			where: { id: friendRequest.id },
			include: {
				sender: {
					select: {
						nickname: true,
					},
				},
				target: {
					select: {
						nickname: true,
					},
				},
			},
		});

		return {
			id: result.id,
			createdAt: result.createdAt,
			senderId: result.senderId,
			senderNickname: result.sender.nickname,
			targetId: result.targetId,
			targetNickname: result.target.nickname,
		};
	}

	async denyFriendRequest(username: string, sender: string) {
		if (username === sender)
			throw new HttpException("Cannot deny a friend request to yourself!", HttpStatus.BAD_REQUEST);

		const userWithFriends = await this.friends(username);

		if (userWithFriends.find((value) => value.username === sender))
			throw new HttpException("Target is already a friend! of you", HttpStatus.BAD_REQUEST);

		const friendRequest = await this.prismaService.friendRequest.findFirst({
			where: {
				sender: { username: sender },
				target: { username },
			},
		});

		if (!friendRequest)
			throw new HttpException("No request from target to accept!", HttpStatus.BAD_REQUEST);

		const result = await this.prismaService.friendRequest.delete({
			where: {
				id: friendRequest.id,
			},
			include: {
				sender: {
					select: {
						nickname: true,
					},
				},
				target: {
					select: {
						nickname: true,
					},
				},
			},
		});

		return {
			id: result.id,
			createdAt: result.createdAt,
			senderId: result.senderId,
			senderNickname: result.sender.nickname,
			targetId: result.targetId,
			targetNickname: result.target.nickname,
		};
	}

	async cancelFriendRequest(username: string, target: string) {
		if (username === target)
			throw new HttpException(
				"Cannot cancel a friend request to yourself!",
				HttpStatus.BAD_REQUEST
			);

		const friendRequest = await this.prismaService.friendRequest.findFirst({
			where: {
				sender: { username },
				target: { username: target },
			},
		});

		if (!friendRequest)
			throw new HttpException("No request was sent from you to target!", HttpStatus.BAD_REQUEST);

		const result = await this.prismaService.friendRequest.delete({
			where: { id: friendRequest.id },
			include: {
				sender: {
					select: {
						nickname: true,
					},
				},
				target: {
					select: {
						nickname: true,
					},
				},
			},
		});
		return {
			id: result.id,
			createdAt: result.createdAt,
			senderId: result.senderId,
			senderNickname: result.sender.nickname,
			targetId: result.targetId,
			targetNickname: result.target.nickname,
		};
	}

	async unfriendUser(username: string, target: string) {
		if (username === target)
			throw new HttpException("Cannot unfriend yourself!", HttpStatus.BAD_REQUEST);

		const targetUser = await this.prismaService.user.findUnique({
			where: { username: target },
		});

		if (!targetUser) throw new HttpException("Target does not exist!", HttpStatus.NOT_FOUND);

		const userWithFriends = await this.friends(username);

		if (!userWithFriends.find((friend) => friend.username === target))
			throw new HttpException("Target is not your friend!", HttpStatus.BAD_REQUEST);

		const result = await Promise.all([
			this.prismaService.user.update({
				where: { username: target },
				data: {
					friends: { disconnect: { username } },
				},
				select: {
					username: true,
					nickname: true,
				},
			}),
			this.prismaService.user.update({
				where: { username },
				data: {
					friends: { disconnect: { username: target } },
				},
				select: {
					username: true,
					nickname: true,
				},
			}),
		]);

		return {
			senderId: result[1].username,
			senderNickname: result[1].nickname,
			targetId: result[0].username,
			targetNickname: result[0].nickname,
		};
	}
}
