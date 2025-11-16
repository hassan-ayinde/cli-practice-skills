#!/usr/bin/env node

const cliCommands = process.argv.slice(2);
const [userName, repoName] = cliCommands;
if (!userName || !repoName) {
  console.error("Usage: github-activity <github-username> <repository-name>");
  process.exit(1);
}

const getUserActivity = async () => {
  try {
    const response = await fetch(
      `https://api.github.com/users/${userName}/events`
    );
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    const events = await response.json();
    return events;
  } catch (error) {
    console.error("Error fetching user activity:", error);
    process.exit(1);
  }
};

const displayActivity = async () => {
  const events = await getUserActivity();
  if (events) {
    console.log(`Recent activity for GitHub user: ${userName}`);
    const fullRepo = `${userName}/${repoName}`;
    const repoExist = events.some((e) => e.repo.name === fullRepo);
    if (!repoExist) {
      console.log(`No recent activity found for repository: ${fullRepo}`);
      return;
    }
    const commitCount = events.filter(
      (e) => e.type === "PushEvent" && e.repo.name === fullRepo
    );
    commitCount.length > 0
      ? console.log(`- Pushed ${commitCount.length} commit(s) to ${fullRepo}`)
      : console.log(`- No recent commits to ${fullRepo}`);

    events.forEach((event) => {
      const { type, repo, payload } = event;
      switch (type) {
        case "IssuesEvent":
          if (repo.name === fullRepo) {
            if (payload.action == "opened") {
              console.log(`- Opened a new issue in ${fullRepo}`);
            }
          } else {
            console.log(`- No recent issues opened in ${fullRepo}`);
          }
          break;
        case "WatchEvent":
          if (repo.name === fullRepo) {
            if (payload.action === "started") {
              console.log(`- Starred ${fullRepo}`);
            }
          } else {
            console.log(`- No recent stars for ${fullRepo}`);
          }
          break;
        default:
          break;
      }
    });
  }
};
displayActivity();
