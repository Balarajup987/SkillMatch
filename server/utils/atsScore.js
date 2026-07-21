export const calculateATS = (
  resumeText,
  jobRequirements
) => {
  const lowerResume =
    resumeText.toLowerCase();

  const matchedSkills =
    jobRequirements.filter((skill) =>
      lowerResume.includes(
        skill.toLowerCase()
      )
    );

  const missingSkills =
    jobRequirements.filter(
      (skill) =>
        !lowerResume.includes(
          skill.toLowerCase()
        )
    );
  const score =
    jobRequirements.length > 0
      ? Math.round(
          (matchedSkills.length /
            jobRequirements.length) * 100
        )
      : 0;

  return {
    score,
    matchedSkills,
    missingSkills
  };
};