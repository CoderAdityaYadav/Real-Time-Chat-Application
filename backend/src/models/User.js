import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String, required: true,
    }, email: {
        type: String, required: true, unique: true
    }, password: {
        type: String, required: true, minLength: 6
    }, profilePic: {
        type: String, default: ""
    }
}, { timestamps: true });

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

export default mongoose.model("User", userSchema);