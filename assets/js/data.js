/* Project data for the WORK section.
   Add or edit entries here; cards and case files are generated from this list.

   Fields
   - id, title, sub, kind, context, year
   - piece:  I O T S Z J L  (tetromino icon)
   - color:  purple | green | pink | cyan | yellow | orange | blue
   - tags:   any of vision, 3d, gen, llm, research  (used by the filters)
   - boss:   true = featured, full-width card; visual: 'splat' | 'stack' | 'video' | 'race'
   - video:  { src, poster, label }            for visual: 'video'
   - race:   [{ label, rows: [[name, seconds], ...] }]  for visual: 'race'
   - figures: [{ type: 'img' | 'video', src, alt, caption, poster }]  shown in the case file
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
        id: 'gaussian-blobs',
        boss: true,
        visual: 'video',
        video: {
            src: 'assets/media/tribolium-blobs.mp4',
            poster: 'assets/media/tribolium-blobs-poster.webp',
            label: 'TRIBOLIUM EMBRYO · REAL vs 750 BLOBS'
        },
        title: 'Gaussian Blobs',
        sub: '3D Gaussians for light-sheet microscopy: do the nuclei survive?',
        kind: 'RESEARCH · MICROSCOPY',
        context: 'TU Dresden team project · Nov 2026',
        piece: 'Z',
        color: 'pink',
        tags: ['vision', '3d', 'research'],
        summary: 'Light-sheet microscopes record embryos as terabytes of 3D volumes. We stored them as 3D Gaussian blobs and asked the question PSNR skips: after compression, can biologists still find the cell nuclei?',
        steps: [
            ['Phantom', 'Known-answer test volume'],
            ['Fit', 'Stretched blobs, one per nucleus'],
            ['Cap', 'Size cap keeps faint nuclei'],
            ['Compare', 'vs JPEG2000 at equal bytes']
        ],
        meta: [
            ['Where', 'TU Dresden · Chair of ML for Spatial Understanding'],
            ['Team', 'with Akim Al-Makhdar'],
            ['Supervisor', 'Prof. Dr. Martin Weigert'],
            ['Date', 'Nov 2026']
        ],
        overview: 'Light-sheet microscopy records living embryos as time series of 3D volumes: one Tribolium frame is 37 million voxels, and real experiments run to terabytes. 3D Gaussian splatting can store a volume as a few thousand soft, stretched blobs, but such fits are judged almost only by PSNR. We asked two questions: can a Gaussian fit keep the nuclei that biologists measure, and does the state-of-the-art Gaussian compressor keep them as well as a standard codec at the same file size?',
        figures: [
            {
                type: 'video',
                src: 'assets/media/tribolium-blobs.mp4',
                poster: 'assets/media/tribolium-blobs-poster.webp',
                w: 588,
                h: 556,
                alt: 'Rotating maximum projections of a Tribolium embryo: the real light-sheet volume next to its 750-Gaussian fit.',
                caption: 'Whole Tribolium embryo, rotating: the real light-sheet volume (left) and its fit with 750 Gaussian blobs (right).'
            },
            {
                type: 'img',
                w: 1600,
                h: 1006,
                src: 'assets/media/tribolium-fit-residual.webp',
                alt: 'Three maximum projections of a Tribolium embryo: the real light-sheet volume, a 750-blob Gaussian fit at 25.7 dB, and the difference between them.',
                caption: 'Real embryo, a 750-blob fit (25.7 dB PSNR), and blobs minus real: blue where the fit is too dim, red where it is too bright. Much of the error sits on individual nuclei, which a global score averages away.'
            }
        ],
        sections: [
            {
                h: 'My part',
                list: [
                    'Re-analysed the exploratory archive (399 fits in 57 experiments) and built the evaluation framework: physical units, object-level nucleus matching and a 24-test regression suite.',
                    'Ran the controlled fitting experiments (Steps 5–8 below), the check against human labels, and the state-of-the-art comparison.'
                ]
            },
            {
                h: 'Fitting: what kept the nuclei',
                list: [
                    'Repeats (5 seeds × 3 budgets): stretched, rotated blobs beat round ones, 22.3 → 25.5 dB, with seed noise of only 0.02–0.13 dB; nucleus F1 0.745 → 0.805 (p = 0.006).',
                    'One starting blob per detected nucleus. Blobs travel under one voxel while fitting and nuclei sit about 20 voxels apart, so the start decides coverage: nuclei found 52% → 71% (110 nuclei, 4 regions).',
                    'Position learning rate: the default was copied from photographic 3DGS and never rescaled to voxel coordinates. Raising it up to 62× let blobs travel (F1 0.64 → 0.78 from random starts): the optimiser was under-scaled, not stuck.',
                    'Size cap on nucleus blobs. Lost faint nuclei had wider blobs, not dimmer ones (11.7 vs 9.1 voxels, p = 0.001). Capping width recovered faint nuclei 13 → 19 of 31 at −0.012 dB PSNR. Promising, not settled: one seed, four regions.'
                ]
            },
            {
                h: 'State of the art at matched bytes',
                list: [
                    'Luxar, a Gaussian compressor for microscopy, against JPEG2000 at identical file size on 12 C. elegans frames with 2,958 human-labelled nuclei, scored by four detectors.',
                    'PSNR preferred JPEG2000 on 12 of 12 frames, yet nuclei kept depended on the detector: below 300× compression, 3D Cellpose found 3.5 points more nuclei in splats, while watershed found 4.0 and 2D Cellpose 9.4 points fewer.',
                    'Beyond 300×, below about three splats per nucleus, splats lost 17–23 points for every detector.'
                ]
            },
            {
                h: 'Also built',
                list: [
                    'Exporters to .ply (68 bytes per Gaussian) and .splat (32 bytes) with an exact geometry round trip, and a three.js browser viewer with z-stretch, a faint-blob threshold and a frame slider for time series.',
                    'Three time-series representations (per-frame sets, native 4D, deformation) compared at matched storage on a synthetic 4D phantom: a cross-fade of per-frame fits won on held-out frames (22.7 dB vs 16.3–19.7 dB).'
                ]
            },
            {
                h: 'Takeaway',
                text: 'PSNR alone cannot decide which storage format is safe for a given analysis. The reusable outcome is the evaluation itself: compare at matched bytes against a verified codec, score with the detector that will actually be used, and fix the pass/fail rules before looking at new data.'
            }
        ],
        stack: ['PyTorch', '3D Gaussian Splatting', 'Luxar', 'Cellpose', 'LoG / watershed', 'JPEG2000', 'three.js', 'A100 / H100'],
        links: [['Code & results on GitHub', 'https://github.com/asadrizvi64/DeepLearning-Seminar-TeamProject']]
    },
    {
        id: 'faster-3dgs',
        boss: true,
        visual: 'race',
        race: [
            { label: 'PART 2 · GARDEN · TIME TO TARGET', rows: [['FASTER-GS', 145], ['MCMC SWITCH', 99]] },
            { label: 'PART 2 · ROOM · TIME TO TARGET', rows: [['FASTER-GS', 140], ['MCMC SWITCH', 90]] },
            { label: 'PART 1 · GARDEN · FULL 30K STEPS', rows: [['FASTER-GS', 256], ['A+B+C+D+S', 170]] }
        ],
        title: 'Faster 3DGS',
        sub: 'Making 3D Gaussian Splatting train faster, in two parts',
        kind: 'RESEARCH · 3DGS',
        context: 'AI-assisted research · TU Dresden Capella (H100) · Nov 2026',
        piece: 'O',
        color: 'yellow',
        tags: ['3d', 'research'],
        summary: 'Part 1 made each training step cheaper: five stacked CUDA changes made Faster-GS 1.45× faster across nine Mip-NeRF 360 scenes at unchanged quality. Part 2 asked whether all 30,000 steps are needed: switching to 3DGS-MCMC at step 5,000 reached the same quality in 25–42% less training time.',
        meta: [
            ['My role', 'Questions, experiment design, review'],
            ['Implementation', 'Claude (Anthropic) in Claude Code'],
            ['Compute', 'TU Dresden Capella · NVIDIA H100'],
            ['Data', 'Mip-NeRF 360 (9 scenes)']
        ],
        overview: 'Two experiments on top of Faster-GS, one of the fastest open-source 3DGS trainers. I set the questions and decided what to test; Claude, working in Claude Code, wrote the CUDA, ran the cluster jobs and did the analysis. Both parts were pre-registered: the metric, the target and what makes a run invalid were written down before any results came in. That caught a failed scene in Part 1 and an invalid first measurement in Part 2.',
        sections: [
            {
                h: 'Part 1 · cheaper steps (1.45×)',
                list: [
                    'A · macro-tile backward pass: neighbouring tiles share what they have loaded (~11% on garden).',
                    'B · selective Adam switched on at step 15,000: only Gaussians visible in that step are updated (~10%).',
                    'C · bfloat16 Adam moments with stochastic rounding (~8%).',
                    'D · deferred gradient accumulation. The first version was 7–9% slower from lost occupancy; the fixed one gained ~1%.',
                    'S · coalesced SH reads through shared memory: that kernel went 1,213 → 341 µs (−72%), ~11% end-to-end on garden.',
                    'Faster on all nine scenes in all 27 head-to-head runs, ~1.5× outdoors; garden 4:16 → 2:50; mean quality +0.019 dB. Every change had to match the reference images and gradients to about one part in a million.'
                ]
            },
            {
                h: 'Part 1 · the honest bits',
                list: [
                    'The pre-registered rule failed on kitchen (−0.171 dB, from two single bad views). The verdict stayed FAIL; a pre-registered 10-seed follow-up came out +0.098 dB.',
                    'Faster-GS shipped the write half of trick S independently on 29 Oct 2026, so 1.45× is against the 10 Oct version. The read half was ported onto their latest code (+40 / −34 lines) to test as an upstream pull request.',
                    'Ideas that lost: skipping pixels outside each exact ellipse (3–5% slower) and merging CPU–GPU round trips (under 1%).'
                ]
            },
            {
                h: 'Part 2 · fewer steps',
                list: [
                    'Train standard Faster-GS to step 5,000, then switch to 3DGS-MCMC, which relocates, perturbs and regularises a fixed budget of Gaussians instead of adding more. Every variant resumes from the same checkpoint.',
                    'Time to reach standard’s final PSNR minus 0.05 dB: median −31.4% (garden) and −35.5% (room) over three seeds. MCMC got there first in all 12 pairs (25–42% saved), ended 0.19–0.44 dB higher, with about 27% fewer Gaussians.',
                    'Why: 29–40% fewer steps but only 5–12% cheaper steps. Fewer steps explain ~72% of the saving on garden and ~92% on room, and MCMC grown to standard’s size was still faster.',
                    'Ablation: relocation is the essential ingredient (4 of 6 runs never reached the target without it); noise and regularisation matter; the doubled opacity learning rate does not.',
                    'The first attempt was invalid: rebuilding the LPIPS network during evaluation drew from the same RNG as the photo shuffle and changed the training order from step 5,168. Fixed by saving and restoring RNG state, with automatic checks on every run.'
                ]
            }
        ],
        stack: ['CUDA', 'PyTorch', 'Faster-GS', '3DGS-MCMC', 'bfloat16', 'H100 cluster', 'Mip-NeRF 360'],
        links: [
            ['Part 1 on Medium', 'https://medium.com/@asadrizvi64/i-asked-an-ai-to-make-3d-scenes-train-faster-heres-what-happened-7201f5ce8bae'],
            ['Part 2 on Medium', 'https://asadrizvi64.medium.com/same-quality-in-fewer-steps-part-2-of-making-3d-scenes-train-faster-970ce25b3aa9'],
            ['Code & logs on GitHub', 'https://github.com/asadrizvi64/3dgs-project']
        ]
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
        tags: ['vision', 'gen', '3d', 'research'],
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
