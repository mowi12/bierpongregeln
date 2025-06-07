import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

function FlavorPreamble() {
  return (
    // <div className="mb-5">
    //   <span>Viel Spaß mit diesem Flavor!</span>
    //   <br />
    //   <span>Zu beachten ist, dass </span>
    //   <a href="../regelwerk#flavors">Flavors</a>
    //   <span>
    //     {" "}
    //     die Regeln des zugrunde liegenden Regelwerks abändern, entfernen{" "}
    //   </span>
    //   <span>und/oder um neue Regeln erweitern.</span>
    //   <br />
    //   <span>Es empfiehlt sich, vorher das </span>
    //   <a href="../regelwerk">Regelwerk</a>
    //   <span> durchzulesen.</span>
    // </div>
    <Alert className="mb-5 border-0 border-l-4 border-callout">
      <AlertTitle>Viel Spaß mit diesem Flavor!</AlertTitle>
      <AlertDescription>
        <p className="mb-0">
          <span>Zu beachten ist, dass </span>
          <a href="../regelwerk#flavors">Flavors</a>
          <span>
            {" "}
            die Regeln des zugrunde liegenden Regelwerks abändern, entfernen
            und/oder um neue Regeln erweitern.
          </span>
          <br />
          <span>Es empfiehlt sich, vorher das </span>
          <a href="../regelwerk">Regelwerk</a>
          <span> durchzulesen.</span>
        </p>
      </AlertDescription>
    </Alert>
  );
}

export default FlavorPreamble;
