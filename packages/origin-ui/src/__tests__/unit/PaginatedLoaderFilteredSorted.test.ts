import {
    PaginatedLoaderFilteredSorted,
    IPaginatedLoaderFilteredSortedState,
    IPaginatedLoaderFilteredSortedProps,
    getInitialPaginatedLoaderFilteredSortedState
} from '../../components/Table/PaginatedLoaderFilteredSorted';
import { IPaginatedLoaderFetchDataReturnValues } from '../../components/Table/PaginatedLoader';

describe('PaginatedLoaderFilteredSorted', () => {
    it('sortData correctly sorts records by multiple properties', async () => {
        class TestClass extends PaginatedLoaderFilteredSorted<
            IPaginatedLoaderFilteredSortedProps,
            IPaginatedLoaderFilteredSortedState
        > {
            constructor(props: any) {
                super(props);

                this.state = {
                    ...getInitialPaginatedLoaderFilteredSortedState(),
                    currentSort: [],
                    sortAscending: false
                };
            }

            getPaginatedData(): Promise<IPaginatedLoaderFetchDataReturnValues> {
                throw new Error('Method not implemented.');
            }
        }

        const paginationFilteredLoader = new TestClass({});

        paginationFilteredLoader.state = {
            ...getInitialPaginatedLoaderFilteredSortedState(),
            currentSort: [
                'producingDevice.offChainProperties.country',
                'producingDevice.offChainProperties.city'
            ],
            sortAscending: true
        };

        const records = [
            {
                producingDevice: {
                    offChainProperties: {
                        country: 'Germany',
                        city: 'Berlin'
                    }
                }
            },
            {
                producingDevice: {
                    offChainProperties: {
                        country: 'Thailand',
                        city: 'Bangkok'
                    }
                }
            },
            {
                producingDevice: {
                    offChainProperties: {
                        country: 'Thailand',
                        city: 'Ang Thong'
                    }
                }
            }
        ];

        expect(paginationFilteredLoader.sortData(records)).toEqual([
            {
                producingDevice: {
                    offChainProperties: {
                        country: 'Germany',
                        city: 'Berlin'
                    }
                }
            },
            {
                producingDevice: {
                    offChainProperties: {
                        country: 'Thailand',
                        city: 'Ang Thong'
                    }
                }
            },
            {
                producingDevice: {
                    offChainProperties: {
                        country: 'Thailand',
                        city: 'Bangkok'
                    }
                }
            }
        ]);

        paginationFilteredLoader.state = {
            ...getInitialPaginatedLoaderFilteredSortedState(),
            currentSort: [
                'producingDevice.offChainProperties.country',
                'producingDevice.offChainProperties.city'
            ],
            sortAscending: false
        };

        expect(paginationFilteredLoader.sortData(records)).toEqual([
            {
                producingDevice: {
                    offChainProperties: {
                        country: 'Thailand',
                        city: 'Bangkok'
                    }
                }
            },
            {
                producingDevice: {
                    offChainProperties: {
                        country: 'Thailand',
                        city: 'Ang Thong'
                    }
                }
            },
            {
                producingDevice: {
                    offChainProperties: {
                        country: 'Germany',
                        city: 'Berlin'
                    }
                }
            }
        ]);
    });

    it('sorts data correctly when passing function to be run primer on data', async () => {
        class TestClass extends PaginatedLoaderFilteredSorted<
            IPaginatedLoaderFilteredSortedProps,
            IPaginatedLoaderFilteredSortedState
        > {
            constructor(props: any) {
                super(props);

                this.state = {
                    ...getInitialPaginatedLoaderFilteredSortedState(),
                    currentSort: [],
                    sortAscending: false
                };
            }

            getPaginatedData(): Promise<IPaginatedLoaderFetchDataReturnValues> {
                throw new Error('Method not implemented.');
            }
        }

        const paginationFilteredLoader = new TestClass({});

        paginationFilteredLoader.state = {
            ...getInitialPaginatedLoaderFilteredSortedState(),
            currentSort: [['energy', value => parseInt(value, 10)]],
            sortAscending: true
        };

        const records = [
            {
                energy: '1000'
            },
            {
                energy: '21'
            },
            {
                energy: '209'
            }
        ];

        expect(paginationFilteredLoader.sortData(records)).toEqual([
            {
                energy: '21'
            },
            {
                energy: '209'
            },
            {
                energy: '1000'
            }
        ]);

        paginationFilteredLoader.state = {
            ...getInitialPaginatedLoaderFilteredSortedState(),
            currentSort: [['energy', value => parseInt(value, 10)]],
            sortAscending: false
        };

        expect(paginationFilteredLoader.sortData(records)).toEqual([
            {
                energy: '1000'
            },
            {
                energy: '209'
            },
            {
                energy: '21'
            }
        ]);
    });
});
