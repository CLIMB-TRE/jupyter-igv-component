import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ReferenceGenome } from "igv";
import Endpoints from "./endpoints";

/** Fetch IGV reference genomes */
const useIGVReferencesQuery = (): UseQueryResult<ReferenceGenome[], Error> => {
  return useQuery({
    queryKey: ["igv-references"],
    queryFn: async () => {
      return fetch(Endpoints.IGV_REFERENCES).then((response) =>
        response.json()
      );
    },
    placeholderData: [],
  });
};

export { useIGVReferencesQuery };
