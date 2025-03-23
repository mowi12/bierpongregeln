import { useEffect, useState } from "react";

const useLastCommitDate = (repo: string, branch = "main") => {
  const [lastCommitDate, setLastCommitDate] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLastCommitDate = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.github.com/repos/${repo}/commits/${branch}`,
        );

        if (!response.ok) throw new Error("Failed to fetch last commit.");

        const data = await response.json();
        const date = new Date(data.commit.committer.date)
          .toLocaleString("de-DE")
          .split(",")[0];
        setLastCommitDate(date);
      } catch (error) {
        console.error("Error fetching last commit date:", error);
        setLastCommitDate("Unknown");
      } finally {
        setLoading(false);
      }
    };

    fetchLastCommitDate();
  }, [repo, branch]);

  return { lastCommitDate, loading };
};

export default useLastCommitDate;
