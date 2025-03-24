import { gql } from "@apollo/client";

export const OMNIBUS = gql`
  query OmnibusQuery {
    incompleteGroups {
      id
      title
      comment
      createdAt
      status
      tags
      updatedAt
      scans {
        id
        status
        path
        scannedAt
        scanner
        rotation
        cropCoordinates
        scanParameters
        originalPath {
          path
        }
        editedPath {
          path
        }
      }
    }
  }
`;

export const GROUPS = gql`
  query Groups($status: String) {
    groups(status: $status) {
      id
      title
      comment
      createdAt
      status
      tags
      updatedAt
      scans {
        id
        status
        path
        scannedAt
        scanner
        rotation
        cropCoordinates
        scanParameters
        originalPath {
          path
        }
        editedPath {
          path
        }
      }
    }
  }
`;

export const GROUP_BY_ID = gql`
  query GroupById($id: Int!) {
    groupById(id: $id) {
      id
      title
      createdAt
      updatedAt
      status
      comment
      tags
    }
  }
`;

export const SCANS_BY_GROUP = gql`
  query ScansByGroup($groupId: Int!) {
    scansByGroup(groupId: $groupId) {
      id
      status
      path
      scannedAt
      scanner
      rotation
      cropCoordinates
      originalPath {
        path
      }
      editedPath {
        path
      }
    }
  }
`;

export const SCAN = gql`
  mutation Scan($name: String!, $parameters: String!, $groupId: Int) {
    scan(name: $name, parameters: $parameters, groupId: $groupId)
  }
`;

export const RESCAN = gql`
  mutation Rescan($scanId: Int!, $name: String!, $parameters: String!) {
    retryScan(scanId: $scanId, name: $name, parameters: $parameters)
  }
`;

export const COMMIT_GROUP = gql`
  mutation CommitGroup($scanIds: [Int!]!, $title: String!) {
    commitGroup(scanIds: $scanIds, title: $title)
  }
`;

export const CREATE_GROUP = gql`
  mutation CreateGroup($status: String!) {
    createGroup(status: $status)
  }
`;

export const UPDATE_GROUP = gql`
  mutation UpdateGroup(
    $id: Int!
    $title: String
    $status: String
    $comment: String
    $tags: [String!]
  ) {
    updateGroup(
      id: $id
      title: $title
      status: $status
      comment: $comment
      tags: $tags
    )
  }
`;

export const ADD_SCAN_TO_GROUP = gql`
  mutation AddScanToGroup($scanId: Int!, $groupId: Int!) {
    addScanToGroup(scanId: $scanId, groupId: $groupId)
  }
`;

export const ROTATE_SCAN = gql`
  mutation RotateScan($scanId: Int!, $rotation: Int!) {
    rotateScan(scanId: $scanId, rotation: $rotation)
  }
`;

export const CROP_SCAN = gql`
  mutation CropScan(
    $scanId: Int!
    $x: Float!
    $y: Float!
    $width: Float!
    $height: Float!
  ) {
    cropScan(scanId: $scanId, x: $x, y: $y, width: $width, height: $height)
  }
`;

export const SCANNERS = gql`
  query Scanners {
    scanners {
      name
      description
    }
  }
`;
