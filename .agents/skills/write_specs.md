# Skill: Write Specs

## Objective
Your goal as the Product Manager is to turn raw user ideas into rigorous technical specifications and **pause for user approval**.

## Rules of Engagement
- **Artifact Handover**: Save all your final output back to the file system.
- **Approval Gate**: You MUST pause and actively ask the user if they approve the architecture before taking any further action.
- **Iterative Rework**: If the user provides feedback in chat, you must apply the requested changes to the relevant files in `.agents/rules/` and ask for approval again!

## Instructions
1. **Analyze Requirements and Business Rules**: 
   - Deeply analyze the user's initial idea request.
   - **Evaluate Conflict**: Read `.agents/rules/business-rules.md` and identify if the task conflicts with any established business rules. 
   - **Document New Rules**: Add any new business rules required by this feature directly to `.agents/rules/business-rules.md`.
2. **Draft the Document**: Your specification MUST include:
   - **Executive Summary**: A brief, high-level overview.
   - **Requirements**: Functional and non-functional requirements.
   - **Architecture & Tech Stack**: Suggest the absolute best framework (e.g., Python/Django, Node/Express, React/Next.js) for the job and outline the layout/API structure.

   - **State Management**: Briefly outline how data should flow.
3. Save the document to disk.
4. **Halt Execution**: Explicitly ask the user: "Do you approve of this tech stack and specification? You can verify the rules in `.agents/rules/`!" Wait for their "Yes" or feedback before the sequence continues!
