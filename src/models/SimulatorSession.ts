import mongoose, { Document, Schema } from 'mongoose';

export interface ISimulatorSession extends Document {
    userId: mongoose.Types.ObjectId;
    scenarioId: mongoose.Types.ObjectId;
    timeTakenSeconds: number;
    passed: boolean;
    playback: {
        offsetSeconds: number;
        code: string;
    }[];
    finalCode: string;
    taskStatus: string;
    createdAt: Date;
}

const SimulatorSessionSchema = new Schema<ISimulatorSession>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    scenarioId: { type: Schema.Types.ObjectId, ref: 'Simulator', required: true, index: true },
    timeTakenSeconds: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    playback: [{
        offsetSeconds: { type: Number, required: true },
        code: { type: String, required: true }
    }],
    finalCode: { type: String, default: "" },
    taskStatus: { type: String, default: "TODO" },
    createdAt: { type: Date, default: Date.now }
});

// Optimization: Index for faster progress tracking
SimulatorSessionSchema.index({ userId: 1, passed: 1 });
SimulatorSessionSchema.index({ userId: 1, scenarioId: 1 });

export default mongoose.models.SimulatorSession || mongoose.model<ISimulatorSession>('SimulatorSession', SimulatorSessionSchema);
