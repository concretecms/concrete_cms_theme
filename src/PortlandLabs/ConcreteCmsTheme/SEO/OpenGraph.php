<?php

namespace PortlandLabs\ConcreteCmsTheme\SEO;

class OpenGraph
{

    public const TAG_OG_URL = 'og:url';
    public const TAG_OG_TITLE = 'og:title';
    public const TAG_OG_DESCRIPTION = 'og:description';
    public const TAG_OG_IMAGE = 'og:image';
    public const TAG_OG_IMAGE_URL = 'og:image:url';
    public const TAG_OG_IMAGE_SECURE_URL = 'og:image:secure_url';
    public const TAG_OG_IMAGE_TYPE = 'og:image:type';
    public const TAG_OG_IMAGE_WIDTH = 'og:image:width';
    public const TAG_OG_IMAGE_HEIGHT = 'og:image:height';
    public const TAG_OG_TYPE = 'og:type';
    public const TAG_OG_LOCALE = 'og:locale';
    public const TAG_OG_VIDEO = 'og:video';
    public const TAG_OG_VIDEO_URL = 'og:video:url';
    public const TAG_OG_VIDEO_SECURE_URL = 'og:video:secure_url';
    public const TAG_OG_VIDEO_TYPE = 'og:video:type';
    public const TAG_OG_VIDEO_WIDTH = 'og:video:width';
    public const TAG_OG_VIDEO_HEIGHT = 'og:video:height';

    public const TAG_FB_APP_ID = 'fb:app_id';


    protected $tags = [];

    /**
     * Set an Open Graph tag value
     *
     * @param string $tag
     * @param string $value
     *
     * @return static
     */
    public function setTag(string $tag, $value)
    {
        $this->tags[$tag] = $value;
        return $this;
    }

    /**
     * Set an Open Graph tag value only if it isn't already set
     *
     * @param string $tag
     * @param string $value
     *
     * @return static
     */
    public function setDefault(string $tag, $value)
    {
        if (!isset($this->tags[$tag])) {
            $this->tags[$tag] = $value;
        }
        return $this;
    }

    /**
     *
     * @param string $tag
     * @param null $default
     * @return mixed|null
     */
    public function getTag(string $tag, $default = null)
    {
        return $this->tags[$tag] ?? $default;
    }

    /**
     * Get the markup for each tag
     *
     * @return array
     */
    public function getMarkup(): array
    {
        $markup = [];
        foreach ($this->tags as $tag => $value) {
            // Don't render falsy values
            if (!$value) {
                continue;
            }

            $tag = h($tag);
            $value = h($value);
            $markup[] = "<meta property='{$tag}' content='{$value}' />";
        }

        return $markup;
    }

}