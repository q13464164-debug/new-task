import mongoose from 'mongoose';

const VaultItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  encryptedData: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.VaultItem || mongoose.model('VaultItem', VaultItemSchema);