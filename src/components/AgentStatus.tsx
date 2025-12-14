import styles from "./AgentStatus.module.css";

export interface AgentMessage {
    agent: string;
    message: string;
}

interface AgentStatusProps {
    messages: AgentMessage[];
}

export default function AgentStatus({ messages }: AgentStatusProps) {
    if (messages.length === 0) return null;

    return (
        <div className={styles.container}>
            <div className={styles.log}>
                {messages.map((msg, index) => (
                    <div key={index} className={styles.message}>
                        <span className={styles.agentName}>{msg.agent}:</span>
                        <span>{msg.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
