import { graphql } from "./gql/gql";

export const OMNIBUS = graphql(`
  query omnibus {
    dividers {
      id
      ts
    }
    scans {
      id
      path
      status
      scannedAt
      scanner
      scanParameters
    }
  }
`);

export const SCAN = graphql(`
  mutation scan($name: String!, $parameters: String!) {
    scan(name: $name, parameters: $parameters)
  }
`);

export const RESCAN = graphql(`
  mutation rescan($name: String!, $parameters: String!, $scanId: Int!) {
    retryScan(name: $name, parameters: $parameters, scanId: $scanId)
  }
`);

export const ADD_DIVIDER = graphql(`
  mutation addDivider {
    addDivider
  }
`);
