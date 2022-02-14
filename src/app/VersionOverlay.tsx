import React, { useEffect, useState } from "react"

interface Version {
  updated: string;
  version: number;
}

export function VersionOverlay() {
  const [data, setData] = useState<Version | undefined>();

  useEffect(() => {
    (async () => {
      const resp = await fetch('version.json');
      const data: Version = await resp.json();
      setData(data);
    })();
  }, []);

  const style: React.CSSProperties = {
    position: 'fixed',
    left: '1em',
    bottom: '1em',
    fontSize: '0.5em',
  };

  return (
    <div style={style}>
      {data ? (
        <>
          version: {data.version}
          <br />
          updated: {data.updated}
        </>
      ) : 'loading...'
      }
    </div>
  )
}
