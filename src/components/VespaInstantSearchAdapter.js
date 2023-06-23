class VespaInstantSearchAdapter {
  constructor({ vespaUrl, indexName }) {
    this.vespaUrl = vespaUrl;
    this.indexName = indexName;
  }

  async search(requests) {
    const { params } = requests[0];

    const requestOptions = {
      query: params.query || '',
      hitsPerPage: params.hitsPerPage || 50,
      page: params.page || 0,
      attributesToRetrieve: params.attributesToRetrieve || ['*'],
      attributesToHighlight: params.attributesToHighlight || [],
      filters: params.filters || '',
      facets: params.facets || [],
      facetFilters: params.facetFilters || [],
    };

    const facetFilters = requestOptions.facetFilters
      .map((filter) => `+(${filter.map((f) => `${f}`).join(' ')})`)
      .join(' ');

    const queryExpression = requestOptions.query;
    const facets = `
    all(
      max(200)
      all(
        all(group(bq_industry_name) max(20) order(-count()) each(output(count())) as(bq_industry_name))
        all(group(bq_public_indicator) max(20) order(-count()) each(output(count())) as(bq_public_indicator))
        all(group(bq_company_isactive) max(20) order(-count()) each(output(count())) as(bq_company_isactive))
        all(group(bq_company_lfo) max(20) order(-count()) each(output(count())) as(bq_company_lfo))
        all(group(bq_company_address1_state_name) max(20) order(-count()) each(output(count())) as(bq_company_address1_state_name))
        )
      )`;
    const searchUrl = `${this.vespaUrl}/search/?query=${encodeURIComponent(
      queryExpression
    )}&select=${facets}&filter=${encodeURIComponent(
      facetFilters
    )}&offset=${requestOptions.page * requestOptions.hitsPerPage}&limit=${requestOptions.hitsPerPage}&summary=quick&ranking=default&type=all`;

    return fetch(searchUrl)
      .then((response) => response.json())
      .then((data) => {
        const { root = {} } = data;
        const { children = [] } = root;

        const facetResult = children.length > 0 ? children[0].children : {};
        const fieldResults = children.slice(1).map((result) => ({
          ...result.fields,
          objectID: result.id
        }));

        const transformedFacetResult = this.transformFacetResults(facetResult);

        return {
          results: [
            {
              hits: fieldResults,
              nbHits: fieldResults.length,
              nbPages: 1, // Vespa doesn't provide total number of pages
              hitsPerPage: requestOptions.hitsPerPage,
              page: requestOptions.page,
              processingTimeMS: 0, // You can provide actual processing time if available
              facets: transformedFacetResult,
            },
          ],
        };
      })
      .catch((error) => {
        console.error('Search request failed', error);
        return { results: [], facets: {} };
      });
  }

  // Implement other methods defined in the SearchClient interface
  addAlgoliaAgent(segment, version) {
    // Implementation
  }

  clearCache() {
    // Implementation
  }

  transformFacetResults(facetData) {
    return Object.entries(facetData).reduce((transformedFacets, [facet, facetValues]) => {
      const facetValueDict = facetValues.children
        .filter((facetItem) => facetItem.value !== '') // Filter out items with empty value
        .reduce((result, facetItem) => {
          result[facetItem.value] = facetItem.fields['count()'];
          return result;
        }, {});
      transformedFacets[facetValues.label] = facetValueDict;
      return transformedFacets;
    }, {});
  }
}

export default VespaInstantSearchAdapter;