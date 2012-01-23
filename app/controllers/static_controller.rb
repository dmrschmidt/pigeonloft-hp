class StaticController < ApplicationController
  
  #
  # The postcard view page.
  #
  def postcard
    @postcard_id = params[:view]
    render :postcard, :layout => false
  end
  
  #
  # The launchrock display page.
  #
  def launch
    render :launch, :layout => false
  end
  
  #
  #
  #
  def welcome
    render :welcome, :layout => "static"
  end
  
  #
  # temp. google apps verification
  #
  def googlecb9784f16be94131
    render :googlecb9784f16be94131, :layout => false
  end
  
end