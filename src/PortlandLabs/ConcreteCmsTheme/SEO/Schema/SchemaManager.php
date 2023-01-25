<?php

namespace PortlandLabs\ConcreteCmsTheme\SEO\Schema;

use Spatie\SchemaOrg\Type;

class SchemaManager
{

    /** @var \Spatie\SchemaOrg\Type */
    protected $schema;

    /**
     * Set the schema thing for this request
     * @param \Spatie\SchemaOrg\Type $schema
     */
    public function setSchema(Type $schema)
    {
        $this->schema = $schema;
    }

    /**
     * Determine whether there is a thing set at all
     * @return bool
     */
    public function hasSchema(): bool
    {
        return null !== $this->schema;
    }

    /**
     * Determine whether there is a thing set at all
     * @return Type|null
     */
    public function getSchema()/*: ?Type*/
    {
        return $this->schema;
    }

}
