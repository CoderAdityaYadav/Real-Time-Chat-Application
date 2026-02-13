import { uploadToCloudinary } from "../lib/cloudinary.js";
import { getReceiverSocketId,io } from "../lib/socket.js";
import Message from "../models/Message.js"
import User from "../models/User.js"

export async function getAllContacts(req, res) {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json({ data: filteredUsers });
    } catch (error) {
       console.log("Error in Getting All Contacts Controller", error.message);
        res.status(500).json("Error in Getting All Contacts Controller", error.message);
    }
}

export async function getMessagesByUserId(req, res) {
    try {
        const myId = req.user._id;
        const userToChatId = req.params.id;
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ]
        })
        res.status(200).json({ data: messages });
    } catch (error) {
       console.log("Error in Getting All Contacts Controller", error.message);
        res.status(500).json("Error in Getting All Contacts Controller", error.message);
    }
}

export async function sendMessage(req, res) {
    try {
        const { text, image } = req.body;
        if (!text && !image) return res.status(400).json({ message: "Text or Image is required" });
        const receiverId = req.params.id;
        const senderId = req.user._id;
        if (senderId.equals(receiverId)) return res.status(400).json({ message: "Cannot send messages to yourself" });
        let imageUrl;
        if (image) {
            imageUrl = await uploadToCloudinary(image, "images");
        }
        const newMessage = await Message.create({
            senderId, receiverId, text, image: imageUrl
        });
        // TODO : send Message in real time if user is online
        const receiverSocketId = getReceiverSocketId(receiverId.toString());
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }
        if (!newMessage) return res.status(500).json({ message: "Server Error Try after some time" });
        res.status(201).json({ data: newMessage });
    } catch (error) {
        console.log("Error in Sending Message Controller", error.message);
        res.status(500).json("Error in Sending Message Controller", error.message);
    }
}

export async function getChatPartners(req, res) {
    try {
        const loggedInUserId = req.user._id.toString();
        // Find all the messages where the logged in User is either reciver or sender
        const messages = await Message.find({
            $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
        });
        const chatPartnerIds = [
            ...new Set(
                messages.map((msg) =>
                    msg.senderId.toString() === loggedInUserId
                        ? msg.receiverId.toString()
                        : msg.senderId.toString()
                )
            )
        ];

        const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select("-password");
        res.status(200).json({data:chatPartners})
    } catch (error) {
         console.log("Error in Getting Chat Partners Controller", error.message);
        res.status(500).json("Error in Getting Chat Partners Controller", error.message);
    }
}