import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ReferenceGenome } from "igv";
import Endpoints from "./endpoints";

/** Fetch reference genomes */
const useReferenceGenomesQuery = (): UseQueryResult<
  ReferenceGenome[],
  Error
> => {
  return useQuery({
    queryKey: ["reference-genomes"],
    queryFn: async () => {
      return fetch(Endpoints.REFERENCE_GENOMES).then((response) =>
        response.json()
      );
    },
    placeholderData: [],
  });
};

export { useReferenceGenomesQuery };
