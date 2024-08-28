import mongoose from "mongoose";

const commentsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    body: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const postsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
    },
    comments: [commentsSchema],
    commentsCount: {
      type: Number,
      default: 0
    },
    lastCommentDate: {
      type: Date
    }
  },
  { timestamps: true }
);

// Pre-save hook
postsSchema.pre('save', function(next) {
  if (this.isModified('comments')) {
    this.commentsCount = this.comments.length;
    if (this.comments.length > 0) {
      this.lastCommentDate = this.comments[this.comments.length - 1].createdAt;
    }
  }
  next();
});

// Pre-update hook
postsSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();
  if (update.$push && update.$push.comments) {
    const post = await this.model.findOne(this.getQuery());
    update.$inc = update.$inc || {};
    update.$inc.commentsCount = 1;
    update.$set = update.$set || {};
    update.$set.lastCommentDate = new Date();
  }
  next();
});

const Posts = mongoose.model("Posts", postsSchema);
export default Posts;