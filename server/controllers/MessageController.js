
import getPrismaInstance from "../utils/PrismaClient.js"
import { renameSync } from "fs"
export const addMessage = async (req, res, next) => {
    try {
        const prisma = getPrismaInstance()
        const { message, from, to } = req.body;
        // const getUser = ononlineUsers?.get(to);
        const getUser = global.ononlineUsers?.get(to);
        if (message && from && to) {
            const newMessage = await prisma.messages.create
                ({
                    data: {
                        message,
                        sender: { connect: { id: from.toString() } },
                        receiver: { connect: { id: to.toString() } },
                        messageStatus: getUser ? "delivered" : "sent",
                    },
                    include: {
                        sender: true,
                        receiver: true

                    }
                });
            return res.status(201).send({ message: newMessage });
        }
        return res.status(400).send("From, to and Message is required.")
    }
    catch (err) {
        next(err)
    }
};


export const getmessages = async (req, res, next) => {

    try {
        const prisma = getPrismaInstance();
        const { from, to } = req.params;

        const messages = await prisma.messages.findMany({
            where: {
                OR: [
                    {
                        senderId: from.toString(),
                        receiverId: to.toString(),

                    },
                    {
                        senderId: to.toString(),
                        receiverId: from.toString(),

                    }

                ],
            },
            orderBy: {
                id: "asc",
            }
        })
        const unreadMessages = [];

        messages.forEach((message, index) => {
            if (message.messageStatus !== "read" &&
                message.senderId === to.toString()
            ) {
                messages[index].messageStatus = "read";

                unreadMessages.push(message.id);
            }
        });

        await prisma.messages.updateMany({

            where: {
                id: { in: unreadMessages },
            },
            data: {
                messageStatus: "read",
            }

        });
        res.status(200).json({ messages });

    }

    catch (err) {
        next(err)
    }
}
export const addImageMessage = async (req, res, next) => {
    try {
        if (req.file) {
            const date = Date.now();
            let fileName = "uploads/images/" + date + req.file.originalname;
            // let fileName = `uploads/images/${date}_${req.file.originalname}`;
            renameSync(req.file.path, fileName);
            const prisma = getPrismaInstance();
            const { from, to } = req.query;
            if (from && to) {
                const message = await prisma.messages.create({
                    data: {
                        message: fileName,
                        sender: { connect: { id: from.toString() } },
                        receiver: { connect: { id: to.toString() } },
                        type: "image"
                    },
                });
                return res.status(201).json({ message });
            }
            return res.status(400).send("from,to is required.");
        }
        return res.status(400).send("Image is required.");
    }
    catch (err) {
        next(err)
    }
}
export const addAudioMessage = async (req, res, next) => {
    try {
        if (req.file) {
            const date = Date.now();
            let fileName = "uploads/recordings/" + date + req.file.originalname;
            renameSync(req.file.path, fileName);
            const prisma = getPrismaInstance();
            const { from, to } = req.query;
            if (from && to) {
                const message = await prisma.messages.create({
                    data: {
                        message: fileName,
                        sender: { connect: { id: from.toString() } },
                        receiver: { connect: { id: to.toString() } },
                        type: "audio"
                    },
                });
                return res.status(201).json({ message });
            }
            return res.status(400).send("from,to is required.");
        }
        return res.status(400).send("audio is required.");
    }
    catch (err) {
        next(err)
    }
}
export const getInitialContactswithMessages = async (req, res, next) => {
    try {
        const userId = req.params.from.toString();
        const prisma = getPrismaInstance()
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                sentMessages: {
                    include: {
                        receiver: true,
                        sender: true
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
                receivedMessages: {
                    include: {
                        receiver: true,
                        sender: true
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                }
            },
        })
        const messages = [...user.sentMessages, ...user.receivedMessages]
        messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        const users = new Map();
        const messageStatusChange = []
        messages.forEach((msg) => {
            const isSender = msg.senderId === userId;
            const calculatedId = isSender ? msg.receiverId : msg.senderId;
            if (msg.messageStatus === "sent") {
                messageStatusChange.push(msg.id)
            }
            const { id,
                type,
                message,
                messageStatus,
                createdAt,
                senderId,
                receiverId,
            } = msg;
            if (!users.get(calculatedId)) {
                let user = {
                    messageId: id,
                    type,
                    message,
                    messageStatus,
                    createdAt,
                    senderId,
                    receiverId,
                }
                if (isSender) {
                    user = {
                        ...user, ...msg.receiver,
                        totalUnreadMessages: 0,
                    }
                }
                else {
                    user = {
                        ...user, ...msg.sender,
                        totalUnreadMessages: messageStatus !== "read" ? 1 : 0
                    }
                }
                users.set(calculatedId, { ...user })
            }

            else if (messageStatus !== "read" && !isSender) {
                const user = users.get(calculatedId);
                users.set(calculatedId, {
                    ...user,
                    totalUnreadMessages: user.totalUnreadMessages + 1,
                })
            }
        })
        if (messageStatusChange.length) {
            await prisma.messages.updateMany({

                where: {
                    id: { in: messageStatusChange },
                },
                data: {
                    messageStatus: "delivered",
                }

            });
        }
        return res.status(200).json({

            users: Array.from(users.values()),
            onlineUsers: Array.from(onlineUsers.keys()),
        });
    }
    catch (err) {
        next(err)
    }
}