import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ReferenceGenome } from "igv";
import Endpoints from "./endpoints";

/** Fetch IGV reference genomes */
const useIGVReferenceGenomesQuery = (): UseQueryResult<
  ReferenceGenome[],
  Error
> => {
  return useQuery({
    queryKey: ["igv-reference-genomes"],
    queryFn: async () => {
      return fetch(Endpoints.IGV_REFERENCE_GENOMES).then((response) =>
        response.json()
      );
    },
    placeholderData: [],
  });
};

export { useIGVReferenceGenomesQuery };
