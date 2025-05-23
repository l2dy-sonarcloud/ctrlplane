import type { Tx } from "@ctrlplane/db";
import type * as schema from "@ctrlplane/db/schema";
import _ from "lodash";

import type { ReleaseIdPolicyChecker } from "./policies/utils.js";
import { isPassingLockingPolicy } from "./lock-checker.js";
import { isPassingConcurrencyPolicy } from "./policies/concurrency-policy.js";
import { isPassingJobRolloutPolicy } from "./policies/gradual-rollout.js";
import { isPassingApprovalPolicy } from "./policies/manual-approval.js";
import { isPassingMinReleaseIntervalPolicy } from "./policies/min-release-interval-policy.js";
import {
  isPassingNewerThanLastActiveReleasePolicy,
  isPassingNoActiveJobsPolicy,
} from "./policies/release-sequencing.js";
import { isPassingReleaseWindowPolicy } from "./policies/release-window.js";
import { isPassingCriteriaPolicy } from "./policies/success-rate-criteria-passing.js";

const baseChecks: ReleaseIdPolicyChecker[] = [
  isPassingLockingPolicy,
  isPassingApprovalPolicy,
  isPassingCriteriaPolicy,
  isPassingConcurrencyPolicy,
  isPassingJobRolloutPolicy,
  isPassingNoActiveJobsPolicy,
  isPassingReleaseWindowPolicy,
  isPassingMinReleaseIntervalPolicy,
];

export const isPassingAllPolicies = async (
  db: Tx,
  releaseJobTriggers: schema.ReleaseJobTrigger[],
) => {
  if (releaseJobTriggers.length === 0) return [];
  const checks: ReleaseIdPolicyChecker[] = [
    ...baseChecks,
    isPassingNewerThanLastActiveReleasePolicy,
  ];
  let passingJobs = releaseJobTriggers;

  for (const check of checks) passingJobs = await check(db, passingJobs);

  return passingJobs;
};

export const isPassingAllPoliciesExceptNewerThanLastActive = async (
  db: Tx,
  releaseJobTriggers: schema.ReleaseJobTrigger[],
) => {
  if (releaseJobTriggers.length === 0) return [];

  let passingJobs = releaseJobTriggers;
  for (const check of baseChecks) passingJobs = await check(db, passingJobs);

  return passingJobs;
};
