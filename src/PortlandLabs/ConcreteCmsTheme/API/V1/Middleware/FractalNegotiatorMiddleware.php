<?php

/**
 * @project:   ConcreteCMS Theme
 *
 * @copyright  (C) 2021 Portland Labs (https://www.portlandlabs.com)
 * @author     Fabian Bitter (fabian@bitter.de)
 */

namespace PortlandLabs\ConcreteCmsTheme\API\V1\Middleware;

use Concrete\Core\Http\Middleware\FractalNegotiatorMiddleware as CoreFractalNegotiatorMiddleware;
use PortlandLabs\ConcreteCmsTheme\API\V1\Serializer\SimpleSerializer;

class FractalNegotiatorMiddleware extends CoreFractalNegotiatorMiddleware
{

    public function getSerializer()
    {
        return new SimpleSerializer();
    }

}