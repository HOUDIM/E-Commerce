const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: String,
    imageUrl: String,
    slug: String,
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    active: { type: Boolean, default: true }
  }, { timestamps: true });