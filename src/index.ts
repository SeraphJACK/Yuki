import { Application } from "probot";
import { addLabel, closeIssue, commentIssue, isSuperUser } from "./utils";

export = (app: Application) => {
  app.on("issues.opened", async (context) => {
    const title: string = context.payload.issue.title;
    const user: string = context.payload.issue.user.login;

    const titleMatch = title.match(/^\[([^\]]+)\]/);
    if (!titleMatch) {
      // invalid title
      await commentIssue(context, "Thanks for opening this issue!");
      return;
    }

    const meta = titleMatch[1];
    switch (meta) {
      case "New Content Request":
        await addLabel(context, "Type: New Content");
        break;
      case "Erratum/Errata":
        await addLabel(context, "Type: Errata");
        break;
      default:
        // Invalid meta & Not SuperUser
        if (!isSuperUser(user)) {
          await commentIssue(context, `Invalid meta: ${meta}, Closing.`);
          closeIssue(context);
        }
        break;
    }

    await addLabel(context, "Status: Pending");
  });

  app.on("issue_comment", async (context) => {
    app.log(context);
  });

  app.on("pull_request", async (context) => {
    app.log(context);
  });
};