/**
 * PortfolioChatbot Engine
 * Encapsulates resume intelligence data, natural language intent processing,
 * and interface state rendering for Sai Dari's portfolio.
 */
export default class PortfolioChatbot {
    constructor(config = {}) {
        this.feed = document.getElementById(config.feedId || 'chat-feed');
        this.input = document.getElementById(config.inputId || 'chat-input');
        this.submitBtn = document.getElementById(config.submitBtnId || 'chat-submit');
        this.chipContainer = document.getElementById(config.chipContainerId || 'chip-container');
        
        // Knowledge base containing specific open source repositories & contribution telemetry
        this.knowledgeBase = {
            opensource: "Sai actively writes and maintains open-source architectures. Key systems include his Healthcare Agentic AI System (https://github.com/saiteja6006/Healthcare-Agentic-AI-decision-support-system) and the automated AI Invoice System (https://github.com/saiteja6006/AI-Invoice-System). He also contributes downstream to elite frameworks like Hugging Face LeRobot—check out his performance PR #4044 (https://github.com/huggingface/lerobot/pull/4044) and OpenCV-related camera pipeline Issue #4059 (https://github.com/huggingface/lerobot/issues/4059).",
            agentic: "Sai built the Healthcare-Agentic-AI-decision-support-system using LangChain and AutoGen, orchestrating 4 operational agents to handle clinical evidence loops. See the source here: https://github.com/saiteja6006/Healthcare-Agentic-AI-decision-support-system",
            rag: "Sai architected the AI-Invoice-System, matching deep semantic RAG vectors over 8K+ document data fields. Explore his extraction pipelines here: https://github.com/saiteja6006/AI-Invoice-System",
            contact: "Sai can be reached immediately for screenings via email at sailypally98@gmail.com or via telephone line text routing at +1 (206) 451-8426.",
            certifications: "Sai holds multiple elite cloud certifications including AWS Certified Machine Learning Engineer, Databricks Generative AI Engineer, and NVIDIA Generative AI LLMs.",
            kpmg: "Sai kicked off his career at KPMG as a Python Developer Intern (Feb 2019 - Aug 2019), building an enterprise NLP assistant via Rasa and TensorFlow to automate clinical workflows before advancing to a full-time ML Engineer position.",
            default: "Thanks for checking out Sai's profile. You can find deep experience mappings across production systems at Walmart, BCBS, and KPMG listed directly in the timeline metrics on this page!"
        };
    }

    init() {
        if (!this.feed || !this.input) {
            console.error("Chatbot initialization failed: Required DOM endpoints missing.");
            return;
        }
        this.injectAnimationStyles();
        this.registerEvents();
    }

    /**
     * Programmatically injects hardware-accelerated smooth slide-up keyframes 
     * to eliminate manual HTML header stylesheet dependencies.
     */
    injectAnimationStyles() {
        if (document.getElementById('chatbot-runtime-animations')) return;
        
        const styleBlock = document.createElement('style');
        styleBlock.id = 'chatbot-runtime-animations';
        styleBlock.textContent = `
            @keyframes chatbotSlideUp {
                from {
                    opacity: 0;
                    transform: translateY(16px) scale(0.98);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            .animate-chat-stream {
                animation: chatbotSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                will-change: transform, opacity;
            }
        `;
        document.head.appendChild(styleBlock);
    }

    registerEvents() {
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.handleUserMessage();
        });
        if (this.submitBtn) {
            this.submitBtn.addEventListener('click', () => this.handleUserMessage());
        }

        if (this.chipContainer) {
            this.chipContainer.addEventListener('click', (e) => {
                const targetChip = e.target.closest('[data-chip]');
                if (targetChip) {
                    const intentKey = targetChip.getAttribute('data-chip');
                    const chipText = targetChip.textContent.trim();
                    this.executeStream(chipText, intentKey);
                }
            });
        }
    }

    appendMessage(text, isUser = false) {
        const block = document.createElement("div");
        
        block.className = isUser 
            ? "bg-indigo-600 text-white p-3 rounded-xl max-w-[85%] self-end leading-relaxed shadow-sm animate-chat-stream" 
            : "bg-zinc-900 text-zinc-300 p-3 rounded-xl max-w-[85%] self-start border border-zinc-800/60 leading-relaxed animate-chat-stream";
        block.textContent = text;
        
        this.feed.appendChild(block);
        
        this.feed.scrollTo({
            top: this.feed.scrollHeight,
            behavior: 'smooth'
        });
    }

    executeStream(visibleText, intentKey) {
        this.appendMessage(visibleText, true);
        setTimeout(() => {
            const answer = this.knowledgeBase[intentKey] || this.knowledgeBase.default;
            this.appendMessage(answer);
        }, 350);
    }

    handleUserMessage() {
        const promptText = this.input.value.trim();
        if (!promptText) return;

        this.appendMessage(promptText, true);
        this.input.value = "";

        const cleanToken = promptText.toLowerCase();
        let matchedIntent = "default";

        // Upgraded Token Matrix parsing for Hugging Face & LeRobot keyword routing
        if (
            cleanToken.includes("open source") || 
            cleanToken.includes("opensource") || 
            cleanToken.includes("contrib") || 
            cleanToken.includes("github") ||
            cleanToken.includes("lerobot") ||
            cleanToken.includes("huggingface") ||
            cleanToken.includes("opencv")
        ) {
            matchedIntent = "opensource";
        } else if (cleanToken.includes("agent") || cleanToken.includes("autogen") || cleanToken.includes("healthcare")) {
            matchedIntent = "agentic";
        } else if (cleanToken.includes("rag") || cleanToken.includes("invoice") || cleanToken.includes("system")) {
            matchedIntent = "rag";
        } else if (cleanToken.includes("phone") || cleanToken.includes("email") || cleanToken.includes("contact")) {
            matchedIntent = "contact";
        } else if (cleanToken.includes("cert") || cleanToken.includes("aws") || cleanToken.includes("nvidia")) {
            matchedIntent = "certifications";
        } else if (cleanToken.includes("kpmg") || cleanToken.includes("intern") || cleanToken.includes("rasa")) {
            matchedIntent = "kpmg";
        }

        setTimeout(() => {
            const outputText = this.knowledgeBase[matchedIntent];
            this.appendMessage(outputText);
        }, 400);
    }
}
