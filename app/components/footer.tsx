import packageJSON from "@/../package.json";
import useLastCommitDate from "@/hooks/useLastCommitDate";

interface FooterProps {
  authors: Array<string>;
  additionalText?: string;
}

function Footer(props: FooterProps) {
  const version = packageJSON.version;
  const lastCommitDate = useLastCommitDate("mowi12/bierpongregeln");
  const currentYear = new Date().getFullYear();

  let additionalTextElement = null;
  if (props.additionalText) {
    additionalTextElement = <p>{props.additionalText}</p>;
  }

  return (
    <footer className="text-primary p-5 flex flex-col items-center">
      <p>
        Version {version} (Letztes Update: {lastCommitDate})
      </p>
      <p>
        Copyright &copy; {currentYear} {props.authors.join(", ")}.
      </p>
      {additionalTextElement}
    </footer>
  );
}

export default Footer;
