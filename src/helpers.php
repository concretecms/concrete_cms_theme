<?php

use PortlandLabs\ConcreteCmsTheme\SEO\OpenGraph;
/**
 * OpenGraph accessor function
 *
 * @param string $tag
 * @param string|null $value
 *
 * @return mixed
 */
function og(string $tag, $value = null)
{
    $og = app(OpenGraph::class);
    if ($value === null) {
        return $og->getTag($tag);
    }

    $og->setTag($tag, $value);
    return null;
}