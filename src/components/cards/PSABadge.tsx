import { PSAGrade } from "@/types";

function gradeColor(grade: PSAGrade): string {
  if (grade === null) return "bg-text-muted/20 text-text-muted border-text-muted/30";
  if (grade >= 9) return "bg-accent-gold/20 text-accent-gold border-accent-gold/40";
  if (grade >= 7) return "bg-accent-blue/20 text-accent-blue border-accent-blue/40";
  return "bg-text-secondary/20 text-text-secondary border-text-secondary/30";
}

export default function PSABadge({
  grade,
  size = "sm",
}: {
  grade: PSAGrade;
  size?: "sm" | "lg";
}) {
  const isGraded = grade !== null;

  if (size === "lg") {
    return (
      <div className={`flex flex-col items-center rounded-lg border px-3 py-2 ${gradeColor(grade)}`}>
        <span className="text-[10px] font-bold uppercase tracking-wider">
          {isGraded ? "PSA" : "RAW"}
        </span>
        {isGraded && (
          <span className="text-xl font-black leading-tight">{grade}</span>
        )}
        {!isGraded && (
          <span className="text-xs font-medium">Ungraded</span>
        )}
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-bold ${gradeColor(grade)}`}>
      {isGraded ? `PSA ${grade}` : "RAW"}
    </span>
  );
}
