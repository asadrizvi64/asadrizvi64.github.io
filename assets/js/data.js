/* Project data for the WORK section.
   Add or edit entries here; cards and case files are generated from this list.

   Fields
   - id, title, sub, kind, context, year
   - piece:  I O T S Z J L  (tetromino icon)
   - color:  purple | green | pink | cyan | yellow | orange | blue
   - tags:   any of vision, 3d, gen, llm  (used by the filters)
   - boss:   true = featured, full-width card; visual: 'splat' | 'stack'
   - wide:   true = spans two columns in the grid
   - steps:  [[label, detail], ...]  optional 4-step pipeline
   - meta:   [[label, value], ...]   shown at the top of the case file
   - sections: [{ h, text } | { h, list: [...] }]
   - links:  [[label, url], ...]
*/
window.PROJECTS = [
    {
        id: 'xision',
        boss: true,
        visual: 'splat',
        title: 'XISION',
        sub: 'Photorealistic, animatable 3D avatars on iPhone',
        kind: 'VISION · 3D',
        context: 'KhyaalTech R&D · in development',
        piece: 'T',
        color: 'purple',
        tags: ['vision', '3d'],
        summary: 'Full-body digital humans from a single consumer capture, rendered in real time on mobile. 3D Gaussian Splatting is bound to a fitted SMPL-X body and drawn by a Metal renderer.',
        steps: [
            ['Capture & isolate', 'Remove background, normalise the Gaussian cloud'],
            ['Fit & correct', 'SMPL-X pose / shape, fix orientation & lean'],
            ['Bind & animate', 'Splats to mesh triangles, bake walk / turn'],
            ['Validate & deploy', 'QA, then render on iOS via Metal']
        ],
        meta: [
            ['Context', 'KhyaalTech · R&D'],
            ['Target', 'iPhone, real-time'],
            ['Status', 'In development']
        ],
        overview: 'XISION builds photorealistic, animatable full-body avatars from a consumer capture for real-time visualisation on iPhone. The pipeline combines 3D Gaussian Splatting with a fitted SMPL-X body model and a Metal-based mobile renderer.',
        sections: [
            {
                h: 'What I built',
                list: [
                    'Fixed inverted / head-down capture orientation; restored coherent full-body walking while preserving facial splats.',
                    'A surface-locked animation representation: per-splat triangle coordinates, local offsets and covariance, so splats move with the SMPL-X surface.',
                    'Capture-quality checks for coverage, missing limbs, scale and scan noise, with outputs aligned to the backend API schema.',
                    'Validated offline walk and turntable outputs, and isolated a mobile-specific colour artefact from asset-generation errors.'
                ]
            },
            {
                h: 'Open problems',
                text: 'Shoulder and arm fitting and binding accuracy, intermittent foot artefacts, depth sorting and alpha blending in the Metal renderer, and more photorealism without losing interactive frame rates on mobile.'
            }
        ],
        stack: ['3D Gaussian Splatting', 'SMPL-X', 'PyTorch', 'Geometry processing', 'Metal', 'iOS'],
        links: [['Walk-cycle preview on khyaaltech.com', 'https://khyaaltech.com/#portfolio']]
    },
    {
        id: 'synthralos',
        boss: true,
        visual: 'stack',
        title: 'SynthralOS',
        sub: 'A multi-tenant operating system for AI agents',
        kind: 'AGENTS · INFRA',
        context: 'SynthralOS · Forward Deployed AI Engineer · 2025 – 26',
        piece: 'I',
        color: 'green',
        tags: ['llm'],
        summary: 'One production platform for a fragmented agent ecosystem: runtime, durable workflows, three-tier memory, retrieval and deployment. Co-architected and owned end-to-end, from schema to frontend.',
        meta: [
            ['Company', 'SynthralOS'],
            ['Role', 'Forward Deployed AI Engineer'],
            ['Period', 'Nov 2025 – May 2026'],
            ['Deploy', 'Self-hosted · Coolify + Render']
        ],
        overview: 'SynthralOS puts the fragmented agent-framework ecosystem behind a single multi-tenant platform, covering runtime, memory, retrieval and deployment. As a forward-deployed AI engineer I co-architected the platform and owned it end-to-end, from schema to frontend.',
        sections: [
            {
                h: 'Agent runtime',
                text: '14 polymorphic framework adapters (ReAct, CrewAI, AutoGen, MetaGPT, AutoGPT, Camel, Swarm, AgentGPT, Archon and others) behind a unified dispatcher, with spawn-prevention guardrails and bounded execution.'
            },
            {
                h: 'Workflow engine',
                text: 'Durable execution from a Temporal-style executor combined with LangGraph orchestration. Versioned workflows, deterministic replay, configurable retry policies, dry-run mode, rollback and three-state approval handlers.'
            },
            {
                h: 'Three-tier memory',
                text: 'Mem0 for long-term persistence, Graphiti for relational knowledge (a knowledge graph) and Context7 for in-flight caching, unified behind a single adapter with time-boxed reads and fire-and-forget async writes.'
            },
            {
                h: 'RAG layer',
                text: 'Postgres-canonical retrieval with Qdrant-indexed vector search, indices rebuildable on demand and a pgvector fallback for resilience. PGVector-backed skills and connector registries complete the retrieval surface.'
            },
            {
                h: 'Infra & deployment',
                text: 'About 40 Alembic migrations over a Postgres-canonical schema. Self-hosted production on Coolify + Render with a self-managed Mem0 + Qdrant network. The API surface and frontend are owned end-to-end.'
            }
        ],
        stack: ['Python', 'LangGraph', 'Postgres', 'Qdrant', 'pgvector', 'Mem0', 'Graphiti', 'Alembic', 'Coolify'],
        links: [['Architecture write-up on khyaaltech.com', 'https://khyaaltech.com/#work']]
    },
    {
        id: 'sparse360',
        wide: true,
        title: 'Sparse-View 360',
        sub: 'Sparse-view 360° panoramas & 3D tours',
        kind: 'VISION · 3D TOURS',
        context: 'Client project · 2024',
        piece: 'I',
        color: 'cyan',
        tags: ['vision', '3d'],
        summary: 'High-quality 360° panoramas from a handful of photos with minimal overlap, the case where classic stitchers fail. The panoramas feed a full 3D virtual-tour pipeline.',
        steps: [
            ['Normalise', 'Exposure & contrast'],
            ['Match', 'SuperPoint + SIFT'],
            ['Stitch', 'H + V, homography'],
            ['Finish', 'Inpaint, sharpen']
        ],
        meta: [
            ['Context', 'Client project'],
            ['Domain', 'Virtual tours, property capture'],
            ['Year', '2024']
        ],
        overview: 'Traditional stitching needs heavy image overlap. This pipeline aligns sparse captures using learned and classical features with custom stitching, then extends to dense 3D reconstruction for immersive tours.',
        sections: [
            {
                h: 'Panorama pipeline',
                list: [
                    'Pre-processing: exposure normalisation and contrast enhancement across captures.',
                    'Feature detection and matching with SuperPoint and SIFT, robust under minimal overlap.',
                    'Custom horizontal and vertical stitching with photogeometric homography to close the sphere.',
                    'Post-processing: inpainting of missing regions and sharpening.',
                    'GPU acceleration to handle large capture sets efficiently.'
                ]
            },
            {
                h: '3D reconstruction',
                text: 'Image refinement, polygonal meshes for extended panoramic scenes, and full reconstruction with 3D Gaussian Splatting alongside COLMAP dense maps for high-fidelity spatial capture.'
            }
        ],
        stack: ['SuperPoint', 'SIFT', 'OpenCV', 'Homography', 'COLMAP', '3DGS', 'GPU'],
        links: [['Visuals on khyaaltech.com', 'https://khyaaltech.com/#portfolio']]
    },
    {
        id: 'jewellery-tryon',
        title: 'Jewellery Try-On',
        sub: 'Generative product imagery & jewellery try-on',
        kind: 'GENERATIVE · RETAIL',
        context: 'Client project · 2024',
        piece: 'Z',
        color: 'pink',
        tags: ['vision', 'gen'],
        summary: 'Studio-grade jewellery imagery without a studio: products placed on generated models with natural pose, styling and light.',
        meta: [
            ['Context', 'Client project'],
            ['Domain', 'E-commerce product imagery'],
            ['Year', '2024']
        ],
        overview: 'Hyperrealistic, on-brand product photography and a virtual try-on flow for lifestyle brands. Generative workflows, tuned per brand identity and material language, replace physical shoots.',
        sections: [
            {
                h: 'Pipeline',
                list: [
                    'Product replacement: jewellery inserted with precise placement, keeping the original product detail intact.',
                    'Style reference: outfits, accessories and visual elements matched to the piece’s aesthetic.',
                    'Pose estimation: natural body and hand placement that keeps every piece clearly visible.',
                    'Background removal and generation: scenes that match the product’s luxury positioning.',
                    'Photo-model generation: realistic faces, proportions and clothing.',
                    'Virtual try-on: the same process applied to existing human images for a realistic preview before purchase.'
                ]
            }
        ],
        stack: ['Diffusion', 'Pose estimation', 'Segmentation', 'Compositing', 'PyTorch'],
        links: [['Visuals on khyaaltech.com', 'https://khyaaltech.com/#portfolio']]
    },
    {
        id: 'floorplan',
        title: 'Floorplan-to-3D',
        sub: 'Generative architecture: plans, renders, facades',
        kind: 'GENERATIVE · ARCHITECTURE',
        context: 'Imarat Group · 2024 – 2026',
        piece: 'L',
        color: 'orange',
        tags: ['vision', 'gen', '3d'],
        summary: 'From a flat plan to a furnished 3D render, plus facade extrusion and full exterior remodelling, on fine-tuned diffusion and ControlNet.',
        meta: [
            ['Context', 'Imarat Group, Islamabad'],
            ['Research', 'Paper in progress'],
            ['Year', '2024 – 2026']
        ],
        overview: 'Interior and exterior redesign end-to-end: floor plan alterations, house render generation and facade remodelling, with landscaping and urban modelling so the result fits its surroundings.',
        sections: [
            {
                h: 'What I built',
                list: [
                    'Fine-tuned Stable Diffusion + ControlNet for architectural design; training loss down 82% over 400 epochs.',
                    'Floorplan-to-render generation of redesigned interiors with furniture, fixtures and decor.',
                    'Facade extrusion and exterior remodelling, plus landscaping and urban-context modelling.',
                    'Generative models that turn raw data into architectural insight, improving precision by 30%.'
                ]
            },
            {
                h: 'Research',
                text: '“From Interactive Floorplan Generation to Style Rendering Using Diffusion Models and ControlNet”: a framework for real-time, interactive floor plan creation and style-based rendering in the early stages of design. In progress.'
            }
        ],
        stack: ['Stable Diffusion', 'ControlNet', 'Flux', 'ComfyUI', 'PyTorch'],
        links: [['Visuals on khyaaltech.com', 'https://khyaaltech.com/#portfolio']]
    },
    {
        id: 'lora-lab',
        title: 'Furniture LoRA Lab',
        sub: 'LoRA training platform for product redesign',
        kind: 'GENERATIVE · PRODUCT',
        context: 'Client project · confidential',
        piece: 'J',
        color: 'blue',
        tags: ['gen'],
        summary: 'An extensible LoRA training platform for high-fidelity sofa and furniture redesign: new styles, materials and configurations without reshooting the product.',
        meta: [
            ['Context', 'Client project · confidential'],
            ['Domain', 'Furniture e-commerce']
        ],
        overview: 'A platform for training and serving product-specific adapters, so a furniture catalogue can be restyled generatively instead of re-photographed.',
        sections: [
            {
                h: 'Architecture',
                list: [
                    'ComfyUI as the inference backend.',
                    'Kohya LoRA and DreamBooth training pipelines for product-specific fine-tunes.',
                    'Built to be extended: rapid iteration over product styles, materials and configurations while preserving product fidelity.'
                ]
            }
        ],
        stack: ['ComfyUI', 'Kohya', 'LoRA', 'DreamBooth', 'Stable Diffusion']
    },
    {
        id: 'virtual-fit',
        title: 'Virtual Fit',
        sub: 'Cloth parsing for virtual try-on',
        kind: 'VISION · FASHION',
        context: '2024',
        piece: 'S',
        color: 'green',
        tags: ['vision', 'gen'],
        summary: 'Portraits segmented into upper, lower and full-body garments with clean per-class alpha mattes, ready for StyleGAN-driven try-on.',
        steps: [
            ['Portrait', 'Input'],
            ['U²-Net', 'Parse'],
            ['Masks', 'Upper / lower / full'],
            ['Alpha', 'Per-class mattes']
        ],
        overview: 'Cloth parsing built on a pre-trained U²-Net for human portrait segmentation, with StyleGAN for realistic image generation.',
        sections: [
            {
                h: 'How it works',
                list: [
                    'Parses clothing into three classes: upper body (red), lower body (green) and full body (yellow).',
                    'Generates an alpha image per class for clean compositing in downstream apps.',
                    'StyleGAN generation on top of the masks for realistic try-on and styling.'
                ]
            },
            {
                h: 'Where it fits',
                text: 'Virtual try-on, personalised styling and garment analysis: anywhere precise clothing segmentation matters.'
            }
        ],
        stack: ['U²-Net', 'StyleGAN', 'Segmentation', 'Alpha matting', 'PyTorch']
    },
    {
        id: 'nailsent',
        title: 'NailSent',
        sub: 'Virtual nail polish try-on',
        kind: 'VISION · BEAUTY',
        context: 'Segmentation + GAN styling',
        piece: 'O',
        color: 'yellow',
        tags: ['vision', 'gen'],
        summary: 'Precise nail segmentation, then GAN-generated colours, gradients and patterns that follow each nail’s shape and surface.',
        overview: 'A two-stage pipeline: segment every nail precisely, then synthesise polish textures conditioned on that mask.',
        sections: [
            {
                h: 'Segmentation',
                text: 'DeepLabV3+ with a MobileNetV2 backbone. Atrous convolutions and an encoder-decoder head capture fine nail boundaries across resolutions and cluttered backgrounds; pretrained on large-scale data.'
            },
            {
                h: 'Styling',
                text: 'StyleGAN2 or CycleGAN applies photorealistic polish textures (solid, gradient or pattern) aligned to the nail’s shape and surface.'
            }
        ],
        stack: ['DeepLabV3+', 'MobileNetV2', 'StyleGAN2', 'CycleGAN', 'PyTorch']
    },
    {
        id: 'kisaandost',
        wide: true,
        title: 'KisaanDost AI',
        sub: 'Urdu voice-first assistant for farmers',
        kind: 'LLM · AGRITECH',
        context: 'Final-year project · FAST-NUCES · 2023',
        piece: 'S',
        color: 'green',
        tags: ['llm'],
        summary: 'Farmers ask questions in spoken Urdu, and a Bloomz model fine-tuned on local agricultural data answers in voice, backed by weather data, farmer profiles and an expert-verified dataset.',
        steps: [
            ['Urdu voice', 'Speech in'],
            ['Intent + entities', 'Classify, extract'],
            ['Bloomz 1.7B', 'Fine-tuned answer'],
            ['Spoken reply', 'Speech out']
        ],
        meta: [
            ['My role', 'Led LLM fine-tuning & dataset curation'],
            ['Team', 'Danial Nasir, Asfand Ali Irfan'],
            ['Supervisor', 'Dr. Mirza Omer Beg, FAST-NUCES'],
            ['Year', '2023']
        ],
        overview: 'A mobile-first web and Android app that answers agricultural questions through voice conversations in local languages. Built for farmers who are better served by speech than by text.',
        sections: [
            {
                h: 'Features',
                list: [
                    'Bloomz fine-tuned on local agricultural sources.',
                    'Urdu voice integration for end-to-end spoken conversation.',
                    'Python backend with intent classification and entity extraction.',
                    'Location API for local weather updates; personalised farmer profiles.',
                    'Dataset contributed and fact-checked by industry professionals.',
                    'UI designed in Figma for farmer accessibility.'
                ]
            }
        ],
        stack: ['Bloomz', 'PyTorch', 'Flask', 'Urdu ASR / TTS', 'JavaScript', 'Figma']
    },
    {
        id: 'lead-engine',
        title: 'Lead Engine',
        sub: 'AI lead generation & workflow for real estate',
        kind: 'AI AUTOMATION',
        context: 'Imarat Group · 2024',
        piece: 'L',
        color: 'orange',
        tags: ['llm'],
        summary: 'End-to-end lead capture, AI qualification, CRM sync and personalised property recommendations across six flagship developments.',
        steps: [
            ['Capture', 'Ads, web, events'],
            ['AI qualify', 'Score & prioritise'],
            ['Engage', 'Personal recs'],
            ['Close', 'Proposal → deal']
        ],
        meta: [
            ['Context', 'Imarat Group'],
            ['Scope', '6 real-estate projects']
        ],
        overview: 'A full workflow for generating, qualifying, assigning and converting real-estate leads, with AI handling capture, screening and personalised engagement.',
        sections: [
            {
                h: 'Workflow',
                list: [
                    'Lead sources: website, social media and Google Ads, plus offline campaigns such as exhibitions and print.',
                    'Automated capture from Facebook and Google Ads into the CRM with real-time API sync.',
                    'AI screening of lead quality and priority, followed by agent verification.',
                    'AI-driven property recommendations from user data for personalised engagement.',
                    'Proposal, negotiation and approval stages tracked end-to-end.'
                ]
            },
            {
                h: 'Deployed across',
                text: 'Mall of Imarat · Babylon · Cybertower · Imarat Residencies 1 & 2 · Golf Floras · Hoon Farmhouses.'
            }
        ],
        stack: ['ML lead scoring', 'CRM', 'Zapier', 'Meta Ads', 'Google Ads']
    },
    {
        id: 'insurance-bot',
        title: 'Insurance Assistant',
        sub: 'Rasa + Django conversational agent',
        kind: 'CONVERSATIONAL AI',
        context: 'Insurance client · 2023',
        piece: 'J',
        color: 'blue',
        tags: ['llm'],
        summary: 'Answers policy questions, files claims and generates quotes in real time, using Rasa NLU over a Django backend with WebSockets and CRM sync.',
        overview: 'Rasa integrated with Django to give an insurance company a conversational front door for policy inquiries, claim filing, quotes and support.',
        sections: [
            {
                h: 'NLU',
                text: 'Intents such as greet, inquire_policy and file_claim; entities such as policy_number and insurance_type. The nlu.yml training file is generated dynamically from the database.'
            },
            {
                h: 'Backend',
                list: [
                    'Django models PolicyInformation, InsuranceType and Message; conversations are persisted.',
                    'Endpoints get_policy_info, submit_claim and get_contractor_info, called from Rasa custom actions.',
                    'WebSockets for real-time messaging between the Django frontend and the Rasa server.',
                    'Django authentication for access control; CRM integration for data exchange.'
                ]
            },
            {
                h: 'Dialogue',
                text: 'Stories and rules map conversation paths, a fallback mechanism handles unexpected input, and context is retained across sessions.'
            }
        ],
        stack: ['Rasa', 'Django', 'WebSockets', 'SQLite', 'Python'],
        links: [['Source on GitHub', 'https://github.com/asadrizvi64/Rasa_chatbot']]
    },
    {
        id: 'archgemma',
        title: 'ArchGemma',
        sub: 'RAG for architecture Q&A',
        kind: 'LLM · RAG',
        context: '2024',
        piece: 'T',
        color: 'purple',
        tags: ['llm'],
        summary: 'Synthetic Q&A generated with Llama 3.1 from architecture books, a retriever over it, and a fine-tuned Gemma-2B for grounded answers.',
        steps: [
            ['Question', 'User query'],
            ['Retrieve', 'Top Q/A pairs'],
            ['Generate', 'Gemma-2B'],
            ['Answer', 'Grounded']
        ],
        overview: 'A retrieval-augmented system for architecture questions, trained on synthetic data so domain coverage doesn’t depend on hand-labelled Q&A.',
        sections: [
            {
                h: 'How it works',
                list: [
                    'A Llama 3.1 API pipeline turns architecture books into synthetic question-answer pairs.',
                    'Pre-processing scripts structure the corpus for both retrieval and generation.',
                    'The retriever fetches the most relevant Q/A pairs as context for each query.',
                    'Gemma-2B is fine-tuned on the domain Q/A and generates context-aware answers.',
                    'Training and evaluation scripts are included; weights and configs are published on Hugging Face.'
                ]
            }
        ],
        stack: ['Llama 3.1', 'Gemma-2B', 'RAG', 'Transformers', 'Hugging Face'],
        links: [['Source on GitHub', 'https://github.com/asadrizvi64/ArchGemma']]
    }
];
