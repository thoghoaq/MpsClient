export interface ProductCategory {
    id:       number;
    name:     string;
    parentId: number | null;
    children: ProductCategory[];
}

export interface ProductBrand {
    id:   number;
    name: string;
}

export interface GoongPlaceResponse {
    predictions:       Prediction[];
    executed_time:     number;
    executed_time_all: number;
    status:            string;
}

export interface Prediction {
    description:           string;
    matched_substrings:    any[];
    place_id:              string;
    reference:             string;
    structured_formatting: StructuredFormatting;
    terms:                 any[];
    has_children:          boolean;
    display_type:          string;
    score:                 number;
    plus_code:             PlusCode;
}

export interface PlusCode {
    compound_code: string;
    global_code:   string;
}

export interface StructuredFormatting {
    main_text:      string;
    secondary_text: string;
}
